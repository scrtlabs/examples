use schemars::JsonSchema;
use secret_toolkit_storage::Item;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct MyKeys {
    pub public_key: Vec<u8>,
    pub private_key: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Decrypted {
    pub decrypted: String,
}

#[derive(Serialize, Deserialize)]
pub struct MyMessage {
    pub message: String,
}

pub static DECRYPTED: Item<Decrypted> = Item::new(b"my_decrypted_string");
pub const STORED_MESSAGE: Item<MyMessage> = Item::new(b"stored_message");

pub static MY_KEYS: Item<MyKeys> = Item::new(b"my_keys");
