use secret_toolkit::storage::Item;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct MyMessage {
    pub sender: String,
    pub message: String,
}

pub const STORED_MESSAGE: Item<MyMessage> = Item::new(b"stored_message");
