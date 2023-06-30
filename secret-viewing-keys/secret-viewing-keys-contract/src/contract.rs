use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError,
    StdResult,
};

use crate::{
    msg::{ExecuteMsg, InstantiateMsg, QueryMsg, SecretMessageResponse, ViewingKeyResponse},
    state::{SecretMessage, SECRET_MESSAGE, VIEWING_KEY},
};

use secret_toolkit::viewing_key::{ViewingKey, ViewingKeyStore};

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, StdError> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreateSecretMessage {
            secret_message,
            index,
        } => try_create_secret_message(deps, env, info, secret_message, index),
    }
}

pub fn try_create_secret_message(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    secret_message: SecretMessage,
    index: u8,
) -> StdResult<Response> {
    let my_account = info.sender.as_str();
    let viewing_key = ViewingKey::create(deps.storage, &info, &env, &my_account, b"entropy");

    SECRET_MESSAGE.insert(deps.storage, &viewing_key, &secret_message)?;
    VIEWING_KEY
        .add_suffix(info.sender.as_bytes())
        .insert(deps.storage, &index, &viewing_key)?;
    Ok(Response::default())
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetSecretMessage { viewing_key } => {
            to_binary(&query_secret_message(deps, viewing_key)?)
        }
        QueryMsg::GetViewingKey { wallet, index } => {
            to_binary(&query_viewing_key(deps, wallet, index)?)
        }
    }
}

fn query_secret_message(deps: Deps, viewing_key: String) -> StdResult<SecretMessageResponse> {
    let secret_message_exists = SECRET_MESSAGE.get(deps.storage, &viewing_key);

    match secret_message_exists {
        Some(secret_message) => Ok(SecretMessageResponse {
            secret_message: secret_message,
        }),
        None => Err(StdError::generic_err("Incorrect viewing key")),
    }
}

fn query_viewing_key(deps: Deps, wallet: Addr, index: u8) -> StdResult<ViewingKeyResponse> {
    let viewing_keys_exists = VIEWING_KEY
        .add_suffix(wallet.as_bytes())
        .get(deps.storage, &index);

    match viewing_keys_exists {
        Some(viewing_key) => Ok(ViewingKeyResponse {
            viewing_key: viewing_key,
        }),
        None => Err(StdError::generic_err(
            "There is no viewing key associated with that wallet + index",
        )),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};

    #[test]
    fn test_viewing_keys() {
        let account = "user-1".to_string();

        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info(account.as_str(), &[]);

        // VK not set yet:
        let result = ViewingKey::check(&deps.storage, &account, "fake key");
        assert_eq!(result, Err(StdError::generic_err("unauthorized")));

        ViewingKey::set_seed(&mut deps.storage, b"seed");
        let viewing_key = ViewingKey::create(&mut deps.storage, &info, &env, &account, b"entropy");

        let result = ViewingKey::check(&deps.storage, &account, &viewing_key);
        assert_eq!(result, Ok(()));

        // Create a key with the same entropy. Check that it's different
        let viewing_key_2 =
            ViewingKey::create(&mut deps.storage, &info, &env, &account, b"entropy");
        assert_ne!(viewing_key, viewing_key_2);

        // VK set to another key:
        let result = ViewingKey::check(&deps.storage, &account, "fake key");
        assert_eq!(result, Err(StdError::generic_err("unauthorized")));

        let viewing_key = "custom key";

        ViewingKey::set(&mut deps.storage, &account, viewing_key);

        let result = ViewingKey::check(&deps.storage, &account, viewing_key);
        assert_eq!(result, Ok(()));

        // VK set to another key:
        let result = ViewingKey::check(&deps.storage, &account, "fake key");
        assert_eq!(result, Err(StdError::generic_err("unauthorized")));
    }
}
