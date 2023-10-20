use secret_toolkit::storage::Item;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct MyRandom {
    pub random_bytes: Vec<u8>,
}

pub const STORED_RANDOM: Item<MyRandom> = Item::new(b"stored_random");
