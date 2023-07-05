use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Binary, ContractInfo};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    SendIbcPacket {
        message: String,
    },
    RequestRandom {
        job_id: String,
        callback: CallbackInfo,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(Binary)]
    LastIbcOperation {},
    #[returns(Binary)]
    ViewReceivedLifeAnswer {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum PacketMsg {
    Message { value: String },
    RequestRandom { job_id: String, length: Option<u32> },
    RandomResponse { job_id: String, random: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum RandomCallback {
    RandomResponse {
        random: String,
        job_id: String,
        msg: Option<Binary>,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct CallbackInfo {
    pub msg: Option<Binary>,
    pub contract: ContractInfo,
}
