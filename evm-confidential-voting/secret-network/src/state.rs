use schemars::JsonSchema;
use secret_toolkit_storage::Item;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct MyKeys {
    pub public_key: Vec<u8>,
    pub private_key: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
pub struct DecryptedVotes {
    pub decrypted_votes: Vec<String>,
}

pub static DECRYPTED_VOTES: Item<DecryptedVotes> = Item::new(b"decrypted_votes");

pub static MY_KEYS: Item<MyKeys> = Item::new(b"my_keys");
