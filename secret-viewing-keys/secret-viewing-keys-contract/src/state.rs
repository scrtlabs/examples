use schemars::JsonSchema;
use secret_toolkit::storage::Keymap;
use serde::{Deserialize, Serialize};

pub static SECRET_MESSAGE: Keymap<String, SecretMessage> = Keymap::new(b"secret message");

pub static VIEWING_KEY: Keymap<u8, String> = Keymap::new(b"secret message viewing key");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct SecretMessage {
    pub secret_message: String,
}
