1. cd into ./secret-ibc/relayer

2. run docker:

docker compose up

3. Add keys to hermes

```
hermes keys add --hd-path "m/44'/529'/0'/0/0" --mnemonic-file a.mnemonic --chain secretdev-1
hermes keys add --hd-path "m/44'/529'/0'/0/0" --mnemonic-file a.mnemonic --chain secretdev-2


hermes keys add --chain secretdev-1 --mnemonic-file a.mnemonic 
hermes keys add --chain secretdev-2 --mnemonic-file a.mnemonic 
```

- check keys balance: 

hermes keys balance --chain secretdev-2
hermes keys balance --chain secretdev-1

- add keys to secretcli: 
secretcli keys add --recover a

grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar

secretcli query bank balances "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03"

3. Create Hermes Channel

hermes create channel --a-chain secretdev-1 --b-chain secretdev-2 --a-port transfer --b-port transfer --new-client-connection

hermes start

- send tx:

secretcli config node http://localhost:26657
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03
secretcli tx ibc-transfer transfer transfer channel-0 secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03 1uscrt --from a

secretcli config node http://localhost:36657
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03



4. upload + instantiate contracts:


- cd ./contracts/snip20-reference-impl

- compile contract: 

```
docker run --rm -v "$(pwd)":/contract \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer 
```

- upload contract:

secretcli tx compute store contract.wasm.gz --gas 5000000 --from a --chain-id secretdev-1


- query successful upload: 
 
 secretcli query compute list-code

 - instantiate contract:

```
 random_bytes=$(openssl rand -base64 32)
secretcli tx compute instantiate 1 '{
  "name": "Secret Secret",
  "symbol": "sSCRT",
  "decimals": 6,
  "prng_seed": "'"$random_bytes"'",
"admin": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
"initial_balances": [
{
"address": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
"amount": "1000000000"
}
],
"supported_denoms": ["ibc/834829648E6B51B21713C76E0C1836727DCE221CE3DC8B3AA7BB11F55428887A"]
}' --from a --label snip20 -y
```
- query successful instantiation:

secretcli query compute list-contract-by-code 1

- contract address: secret1mfk7n6mc2cg6lznujmeckdh4x0a5ezf6hx6y8q

- upload ibc contract:
cd into ./ibc-hooks-contract

optimize contract

run:
```
   secretcli tx compute store contract.wasm.gz --gas 5000000 --from a --chain-id secretdev-1
```

- query successful upload: 
 secretcli query compute list-code

 - instantiate contract:
 secretcli tx compute instantiate 2 '{}' --from a --label wrap-ibc -y

- query successful instantiation:
secretcli query compute list-contract-by-code 2

 "contract_address": "secret1gyruqan6yxf0q423t8z5zce3x7np35uw8s8wqc"

- ibc hooks tx: 

# Constants

HUB_CHAIN_ID="secretdev-1"

sSCRT="secret1mfk7n6mc2cg6lznujmeckdh4x0a5ezf6hx6y8q"
WRAP_DEPOSIT_CONTRACT_ADDRESS="secret1gyruqan6yxf0q423t8z5zce3x7np35uw8s8wqc"
myScrtAddress="secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03"

memo=$(echo -n '{"wasm":{"contract":"'$WRAP_DEPOSIT_CONTRACT_ADDRESS'","msg":{"wrap_deposit":{"snip20_address":"'$sSCRT'","recipient_address":"'$myScrtAddress'"}}}}' | base64)

secretcli tx ibc-transfer transfer transfer channel-0 $sSCRT 1uscrt --memo $memo --from a

secretcli query tx 3F6509A3DB4117734DF21AC24838193A1E9C58784FAD7A44533395C93E150734



---

secretcli config node http://localhost:26657
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03

---

secretcli config node http://localhost:36657
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03
