use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};

use crate::{
    errors::CustomContractError,
    msg::{ExecuteMsg, Fee, GetStoredRandomResp, InstantiateMsg, QueryMsg},
};

use crate::msg::QueryMsg::GetStoredRandom;

use crate::state::*;

use ethabi::{encode, Token};
use prost::Message;
use serde_json_wasm::to_string;

use crate::msg::GmpMessage;

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, CustomContractError> {
    match msg {
        ExecuteMsg::SendMessageEvm {
            destination_chain,
            destination_address,
        } => send_message_evm(deps, env, info, destination_chain, destination_address),
    }
}

pub fn send_message_evm(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    destination_chain: String,
    destination_address: String,
) -> Result<Response, CustomContractError> {
    let random = env.block.random.unwrap().0;

    // Message payload to be received by the destination
    let message_payload = encode(&vec![Token::Bytes(random.clone())]);

    let coin = &info.funds[0];

    let my_coin = crate::ibc::Coin {
        denom: coin.denom.clone(),
        amount: coin.amount.clone().to_string(),
    };

    let gmp_message: GmpMessage = GmpMessage {
        destination_chain,
        destination_address,
        payload: message_payload.to_vec(),
        type_: 1,
        fee: Some(Fee {
            amount: coin.amount.clone().to_string(), // Make sure to handle amounts accurately
            recipient: "axelar1aythygn6z5thymj6tmzfwekzh05ewg3l7d6y89".to_string(),
        }),
    };

    let memo = to_string(&gmp_message).unwrap();

    let ibc_message = crate::ibc::MsgTransfer {
        source_port: "transfer".to_string(),
        source_channel: "channel-20".to_string(), // Testnet Osmosis to axelarnet: https://docs.axelar.dev/resources/testnet#ibc-channels
        token: Some(my_coin.into()),
        sender: env.contract.address.to_string(),
        receiver: "axelar1dv4u5k73pzqrxlzujxg3qp8kvc3pje7jtdvu72npnt5zhq05ejcsn5qme5".to_string(),
        timeout_height: None,
        timeout_timestamp: env.block.time.plus_seconds(604_800u64).nanos(),
        memo: memo,
    };

    let cosmos_msg = cosmwasm_std::CosmosMsg::Stargate {
        type_url: "/ibc.applications.transfer.v1.MsgTransfer".to_string(),
        value: Binary(ibc_message.encode_to_vec()),
    };

    STORED_RANDOM.save(
        deps.storage,
        &MyRandom {
            random_bytes: random,
        },
    )?;

    Ok(Response::new().add_message(cosmos_msg))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        GetStoredRandom {} => to_binary(&get_stored_random(deps)?),
    }
}

pub fn get_stored_random(deps: Deps) -> StdResult<GetStoredRandomResp> {
    let state = STORED_RANDOM.load(deps.storage)?;
    Ok(GetStoredRandomResp {
        random_bytes: state.random_bytes,
    })
}
