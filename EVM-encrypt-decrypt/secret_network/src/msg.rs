use cosmwasm_std::Binary;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    TryDecrypt {
        ciphertext: Vec<u8>,
        public_key: Vec<u8>,
    },
    CreateKeys {},
    ReceiveMessageEvm {
        source_chain: String,
        source_address: String,
        payload: Binary,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetKeys {},
    GetDecrypted {},
    GetStoredMessage {},
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct KeysResponse {
    pub public_key: Vec<u8>,
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct DecryptedResponse {
    pub decrypted: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub struct GetStoredMessageResp {
    pub message: String,
}
