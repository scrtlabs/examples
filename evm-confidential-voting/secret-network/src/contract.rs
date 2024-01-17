use crate::error::{ContractError, CryptoError};
use crate::msg::{ExecuteMsg, InstantiateMsg, KeysResponse, QueryMsg, VotesResponse};
use crate::state::{DecryptedVotes, MyKeys, DECRYPTED_VOTES, MY_KEYS};
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use secp256k1::ecdh::SharedSecret;
use secp256k1::{PublicKey, Secp256k1, SecretKey};

//
use aes_siv::aead::generic_array::GenericArray;
use aes_siv::siv::Aes128Siv;
use hex;
use log::*;

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, StdError> {
    deps.api
        .debug(&format!("Contract was initialized by {}", info.sender));

    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateKeys {} => try_create_keys(deps, env),

        ExecuteMsg::DecryptVotes {
            public_key,
            encrypted_message,
        } => try_decrypt_votes(deps, env, public_key, encrypted_message),
    }
}

pub fn try_create_keys(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    let rng = env.block.random.unwrap().0;
    let secp = Secp256k1::new();

    let private_key = SecretKey::from_slice(&rng).unwrap();
    let private_key_string = private_key.to_string();
    let private_key_bytes = hex::decode(private_key_string).unwrap();

    let public_key = PublicKey::from_secret_key(&secp, &private_key);
    let public_key_bytes = public_key.serialize().to_vec();

    let my_keys = MyKeys {
        private_key: private_key_bytes,
        public_key: public_key_bytes,
    };

    MY_KEYS.save(deps.storage, &my_keys)?;

    Ok(Response::default())
}

pub fn try_decrypt_votes(
    deps: DepsMut,
    _env: Env,
    public_key: Vec<u8>,
    encrypted_message: Vec<String>,
) -> Result<Response, ContractError> {
    let my_keys = MY_KEYS.load(deps.storage)?;

    let my_private_key = SecretKey::from_slice(&my_keys.private_key)
        .map_err(|_| StdError::generic_err("Invalid private key"))?;

    let other_public_key = PublicKey::from_slice(&public_key)
        .map_err(|_| StdError::generic_err("Invalid public key"))?;

    let shared_secret = SharedSecret::new(&other_public_key, &my_private_key);
    let key = shared_secret.to_vec();

    let ad_data: &[&[u8]] = &[];
    let ad = Some(ad_data);

    // Convert hex strings to Vec<u8> for decryption function
    let encrypted_message_bytes = hex_to_bytes(&encrypted_message);

    // Decrypt the data
    let decrypted_bytes = aes_siv_decrypt(encrypted_message_bytes, ad, &key)
        .map_err(|e| StdError::generic_err(format!("Error decrypting data: {:?}", e)))?;

    let decrypted_strings = bytes_to_strings(decrypted_bytes).map_err(|e| {
        StdError::generic_err(format!("Error converting bytes to strings: {:?}", e))
    })?;

    // Sort the decrypted_strings by proposal_id
    let mut decrypted_strings_with_id: Vec<(u64, String)> = Vec::new();
    for s in decrypted_strings.iter() {
        let id = extract_proposal_id(s)?;
        decrypted_strings_with_id.push((id, s.clone()));
    }
    decrypted_strings_with_id.sort_by_key(|k| k.0);

    // Update decrypted_votes logic
    let mut decrypted_votes = DECRYPTED_VOTES
        .load(deps.storage)
        .unwrap_or(DecryptedVotes {
            decrypted_votes: Vec::new(),
        });

    for (_, vote_string) in decrypted_strings_with_id {
        if !decrypted_votes.decrypted_votes.contains(&vote_string) {
            decrypted_votes.decrypted_votes.push(vote_string);
        }
    }

    // Save decrypted votes to storage
    DECRYPTED_VOTES.save(deps.storage, &decrypted_votes)?;

    Ok(Response::default())
}

pub fn aes_siv_decrypt(
    ciphertexts: Vec<Vec<u8>>, // Changed to a vector of Vec<u8>
    ad: Option<&[&[u8]]>,
    key: &[u8],
) -> Result<Vec<Vec<u8>>, CryptoError> {
    let ad = ad.unwrap_or(&[&[]]);
    let mut cipher = Aes128Siv::new(GenericArray::clone_from_slice(key));

    let mut decrypted_data_vec = Vec::new();

    for ciphertext in ciphertexts {
        match cipher.decrypt(ad, &ciphertext) {
            Ok(decrypted_data) => {
                decrypted_data_vec.push(decrypted_data);
            }
            Err(e) => {
                warn!("aes_siv_decrypt error: {:?}", e);
                return Err(CryptoError::DecryptionError);
            }
        }
    }

    Ok(decrypted_data_vec)
}

fn bytes_to_strings(decrypted_data_bytes: Vec<Vec<u8>>) -> Result<Vec<String>, StdError> {
    let mut decrypted_strings = Vec::new();
    for decrypted_data in decrypted_data_bytes {
        let decrypted_string = String::from_utf8(decrypted_data).map_err(|e| {
            StdError::generic_err(format!("Error converting data to string: {:?}", e))
        })?;
        decrypted_strings.push(decrypted_string);
    }
    Ok(decrypted_strings)
}

fn hex_to_bytes(hex_vec: &[String]) -> Vec<Vec<u8>> {
    hex_vec
        .iter()
        .map(|hex| {
            hex.trim_start_matches("0x")
                .chars()
                .collect::<Vec<char>>()
                .chunks(2)
                .filter_map(|chunk| {
                    let hex_byte = chunk.iter().collect::<String>();
                    u8::from_str_radix(&hex_byte, 16).ok()
                })
                .collect::<Vec<u8>>()
        })
        .collect()
}

// Function to extract proposal_id from a JSON string
pub fn extract_proposal_id(s: &String) -> Result<u64, StdError> {
    s.split("\"proposal_id\":")
        .nth(1)
        .and_then(|part| part.split(',').next())
        .and_then(|id_str| id_str.trim().parse::<u64>().ok())
        .ok_or(StdError::generic_err("Error parsing proposal_id"))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetKeys {} => to_binary(&query_keys(deps)?),
        QueryMsg::GetVotes {} => to_binary(&query_votes(deps)?),
    }
}

fn query_keys(deps: Deps) -> StdResult<KeysResponse> {
    let my_keys = MY_KEYS.load(deps.storage)?;
    Ok(KeysResponse {
        public_key: my_keys.public_key,
    })
}

fn query_votes(deps: Deps) -> StdResult<VotesResponse> {
    let votes = DECRYPTED_VOTES.load(deps.storage)?;
    Ok(VotesResponse {
        votes: votes.decrypted_votes,
    })
}
