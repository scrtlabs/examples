use aes_siv::aead::generic_array::GenericArray;
use aes_siv::siv::Aes128Siv;
use log::*;
use secp256k1::ecdh::SharedSecret;
use secp256k1::{PublicKey, SecretKey};
use secret_encryption::CryptoError;

fn main() {
    // Hardcoded encrypted data
    let encrypted_data = [
        63, 222, 102, 124, 209, 137, 122, 47, 69, 56, 61, 13, 252, 106, 20, 110, 253, 131, 24, 95,
        66, 156, 161, 119, 221, 144, 64, 16, 97, 39, 249, 107, 9, 134, 129, 94, 205, 37, 153, 61,
        31, 57, 171, 198, 127, 72, 175, 90, 75, 125, 221, 184,
    ];

    let other_public_key = [
        2, 151, 142, 171, 162, 214, 185, 135, 244, 246, 185, 98, 150, 43, 38, 243, 247, 218, 165,
        250, 199, 227, 76, 0, 171, 197, 25, 112, 59, 196, 178, 27, 245,
    ];

    let my_private_key = [
        5, 235, 171, 38, 245, 27, 57, 248, 115, 21, 12, 246, 106, 234, 193, 17, 90, 215, 108, 97,
        60, 56, 16, 193, 146, 150, 243, 104, 236, 18, 197, 134,
    ];

    let my_private_key = SecretKey::from_slice(my_private_key.as_slice()).unwrap();

    let my_public_key = PublicKey::from_slice(other_public_key.as_slice()).unwrap();

    let key = SharedSecret::new(&my_public_key, &my_private_key).to_vec();

    // println!("SharedSecret: {:?}", key);

    // Convert associated data to the correct type
    let ad_data: &[&[u8]] = &[];
    let ad = Some(ad_data);

    // Decrypt
    match aes_siv_decrypt(&encrypted_data, ad, &key) {
        Ok(decrypted_data) => {
            println!(
                "Decrypted data: {:?}",
                String::from_utf8(decrypted_data).unwrap()
            );
        }
        Err(e) => {
            warn!("Error decrypting data: {:?}", e);
        }
    }
}

fn aes_siv_decrypt(
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

// fn aes_siv_encrypt(
//     plaintext: &[u8],
//     ad: Option<&[&[u8]]>,
//     key: &[u8],
// ) -> Result<Vec<u8>, CryptoError> {
//     let ad = ad.unwrap_or(&[&[]]);

//     let mut cipher = Aes128Siv::new(GenericArray::clone_from_slice(key));
//     cipher.encrypt(ad, plaintext).map_err(|e| {
//         warn!("aes_siv_encrypt error: {:?}", e);
//         CryptoError::EncryptionError
//     })
// }
