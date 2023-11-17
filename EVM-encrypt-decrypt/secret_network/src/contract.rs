use crate::error::{ContractError, CryptoError};
use crate::msg::{
    DecryptedResponse, ExecuteMsg, GetStoredMessageResp, InstantiateMsg, KeysResponse, QueryMsg,
};
use crate::state::{Decrypted, MyKeys, MyMessage, DECRYPTED, MY_KEYS, STORED_MESSAGE};
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use secp256k1::ecdh::SharedSecret;
use secp256k1::{PublicKey, Secp256k1, SecretKey};

//
use aes_siv::aead::generic_array::GenericArray;
use aes_siv::siv::Aes128Siv;
use ethabi::{decode, ParamType};
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
        ExecuteMsg::TryDecrypt {
            ciphertext,
            public_key,
        } => try_decrypt(deps, env, ciphertext, public_key),
        ExecuteMsg::ReceiveMessageEvm {
            source_chain,
            source_address,
            payload,
        } => receive_message_evm(deps, source_chain, source_address, payload),
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
    // let public_key_string = public_key.to_string();

    let my_keys = MyKeys {
        private_key: private_key_bytes,
        public_key: public_key_bytes,
    };

    MY_KEYS.save(deps.storage, &my_keys)?;

    Ok(Response::default())
}

pub fn try_decrypt(
    deps: DepsMut,
    _env: Env,
    ciphertext: Vec<u8>,
    public_key: Vec<u8>,
) -> Result<Response, ContractError> {
    let my_keys = MY_KEYS.load(deps.storage)?;

    let my_private_key = SecretKey::from_slice(my_keys.private_key.as_slice()).map_err(|e| {
        ContractError::CustomError {
            val: format!("Invalid private key: {}", e),
        }
    })?;

    let other_public_key =
        PublicKey::from_slice(public_key.as_slice()).map_err(|e| ContractError::CustomError {
            val: format!("Invalid public key: {}", e),
        })?;

    let shared_secret = SharedSecret::new(&other_public_key, &my_private_key);
    let key = shared_secret.to_vec();

    let ad_data: &[&[u8]] = &[];
    let ad = Some(ad_data);

    match aes_siv_decrypt(&ciphertext, ad, &key) {
        Ok(decrypted_data) => {
            match String::from_utf8(decrypted_data.clone()) {
                Ok(decrypted_string) => {
                    let decrypted = Decrypted {
                        decrypted: decrypted_string,
                    };
                    DECRYPTED.save(deps.storage, &decrypted)?;
                    println!("Decrypted data: {:?}", decrypted.decrypted);
                }
                Err(e) => {
                    warn!("Error converting decrypted data to string: {:?}", e);
                    // Optionally, return an error here
                }
            }
        }
        Err(e) => {
            warn!("Error decrypting data: {:?}", e);
            // Optionally, return an error here if you need to indicate a failure to the caller
        }
    }

    Ok(Response::default())
}

pub fn aes_siv_encrypt(
    plaintext: &[u8],
    ad: Option<&[&[u8]]>,
    key: &[u8],
) -> Result<Vec<u8>, CryptoError> {
    let ad = ad.unwrap_or(&[&[]]);

    let mut cipher = Aes128Siv::new(GenericArray::clone_from_slice(key));
    cipher.encrypt(ad, plaintext).map_err(|e| {
        warn!("aes_siv_encrypt error: {:?}", e);
        CryptoError::EncryptionError
    })
}

pub fn aes_siv_decrypt(
    ciphertext: &[u8],
    ad: Option<&[&[u8]]>,
    key: &[u8],
) -> Result<Vec<u8>, CryptoError> {
    let ad = ad.unwrap_or(&[&[]]);

    let mut cipher = Aes128Siv::new(GenericArray::clone_from_slice(key));
    cipher.decrypt(ad, ciphertext).map_err(|e| {
        warn!("aes_siv_decrypt error: {:?}", e);
        CryptoError::DecryptionError
    })
}

pub fn receive_message_evm(
    deps: DepsMut,
    _source_chain: String,
    _source_address: String,
    payload: Binary,
) -> Result<Response, ContractError> {
    // decode the payload
    // executeMsgPayload: [sender, message]
    let decoded = decode(&vec![ParamType::Bytes], payload.as_slice()).unwrap();

    // store message
    STORED_MESSAGE.save(
        deps.storage,
        &MyMessage {
            message: decoded[0].to_string(),
        },
    )?;

    Ok(Response::new())
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetKeys {} => to_binary(&query_keys(deps)?),
        QueryMsg::GetDecrypted {} => to_binary(&query_decrypted(deps)?),
        QueryMsg::GetStoredMessage {} => to_binary(&get_stored_message(deps)?),
    }
}

fn query_decrypted(deps: Deps) -> StdResult<DecryptedResponse> {
    let decrypted = DECRYPTED.load(deps.storage)?;
    Ok(DecryptedResponse {
        decrypted: decrypted.decrypted,
    })
}

pub fn get_stored_message(deps: Deps) -> StdResult<GetStoredMessageResp> {
    let message = STORED_MESSAGE.may_load(deps.storage).unwrap().unwrap();
    let resp = GetStoredMessageResp {
        message: message.message,
    };
    Ok(resp)
}

fn query_keys(deps: Deps) -> StdResult<KeysResponse> {
    let my_keys = MY_KEYS.load(deps.storage)?;
    Ok(KeysResponse {
        public_key: my_keys.public_key,
    })
}
