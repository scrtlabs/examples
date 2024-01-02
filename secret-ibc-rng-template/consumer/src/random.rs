use cosmwasm_std::{Binary, ContractInfo, CosmosMsg, Env, from_json, StdResult, to_json_binary};
use cosmwasm_std::WasmMsg::Execute;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::contract::RandProviderContractInfo;
use crate::random::ExecuteMsg::RequestRandom;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
enum ExecuteMsg {
    RequestRandom {
        job_id: String,
        callback: CallbackInfo,
    },
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

pub fn get_random_msg(
    env: Env,
    provider: RandProviderContractInfo,
    job_id: String,
    _msg: Option<Binary>,
) -> StdResult<CosmosMsg> {
    Ok(CosmosMsg::Wasm(Execute {
        contract_addr: provider.address.to_string(),
        msg: to_json_binary(&RequestRandom {
            job_id,
            callback: CallbackInfo {
                contract: env.contract,
                msg: None,
            },
        })?,
        funds: vec![],
    }))
}

pub fn parse_random_response(msg: Binary) -> StdResult<(String, String, Option<Binary>)> {
    let parsed_msg: RandomCallback = from_json(msg)?;

    match parsed_msg {
        RandomCallback::RandomResponse {
            random,
            job_id,
            msg,
        } => Ok((random, job_id, msg)),
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct CallbackInfo {
    pub msg: Option<Binary>,
    pub contract: ContractInfo,
}
