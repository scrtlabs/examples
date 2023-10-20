use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct IbcCounterpartyHeight {
    revision_number: Option<u64>,
    revision_height: Option<u64>,
}

/// MsgTransfer defines a msg to transfer fungible tokens (i.e Coins) between
/// ICS20 enabled chains. See ICS Spec here:
/// <https://github.com/cosmos/ibc/tree/master/spec/app/ics-020-fungible-token-transfer#data-structures>
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgTransfer {
    /// the port on which the packet will be sent
    #[prost(string, tag = "1")]
    pub source_port: ::prost::alloc::string::String,
    /// the channel by which the packet will be sent
    #[prost(string, tag = "2")]
    pub source_channel: ::prost::alloc::string::String,
    /// the tokens to be transferred
    #[prost(message, optional, tag = "3")]
    pub token: ::core::option::Option<Coin>,
    /// the sender address
    #[prost(string, tag = "4")]
    pub sender: ::prost::alloc::string::String,
    /// the recipient address on the destination chain
    #[prost(string, tag = "5")]
    pub receiver: ::prost::alloc::string::String,
    /// Timeout height relative to the current block height.
    /// The timeout is disabled when set to 0.
    #[prost(message, optional, tag = "6")]
    pub timeout_height: ::core::option::Option<Height>,
    /// Timeout timestamp in absolute nanoseconds since unix epoch.
    /// The timeout is disabled when set to 0.
    #[prost(uint64, tag = "7")]
    pub timeout_timestamp: u64,
    #[prost(string, tag = "8")]
    pub memo: String,
}

/// Coin defines a token with a denomination and an amount.
///
/// NOTE: The amount field is an Int which implements the custom method
/// signatures required by gogoproto.
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Coin {
    #[prost(string, tag = "1")]
    pub denom: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub amount: ::prost::alloc::string::String,
}

/// Height is a monotonically increasing data type
/// that can be compared against another Height for the purposes of updating and
/// freezing clients
///
/// Normally the RevisionHeight is incremented at each height while keeping
/// RevisionNumber the same. However some consensus algorithms may choose to
/// reset the height in certain conditions e.g. hard forks, state-machine
/// breaking changes In these cases, the RevisionNumber is incremented so that
/// height continues to be monitonically increasing even as the RevisionHeight
/// gets reset
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Height {
    /// the revision that the client is currently on
    #[prost(uint64, tag = "1")]
    pub revision_number: u64,
    /// the height within the given revision
    #[prost(uint64, tag = "2")]
    pub revision_height: u64,
}

// We define the response as a prost message to be able to decode the protobuf data.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct MsgTransferResponse {
    pub sequence: u64,
}
