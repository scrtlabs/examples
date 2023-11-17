use crate::CryptoError;

pub const HMAC_SIGNATURE_SIZE: usize = 32;
pub const EC_256_PRIVATE_KEY_SIZE: usize = 32;

pub trait Encryptable {
    fn encrypt(&self, plaintext: &[u8]) -> Result<Vec<u8>, CryptoError>;
    fn decrypt(&self, ciphertext: &[u8]) -> Result<Vec<u8>, CryptoError>;
}

pub trait SIVEncryptable {
    fn encrypt_siv(&self, plaintext: &[u8], ad: Option<&[&[u8]]>) -> Result<Vec<u8>, CryptoError>;
    fn decrypt_siv(&self, plaintext: &[u8], ad: Option<&[&[u8]]>) -> Result<Vec<u8>, CryptoError>;
}
