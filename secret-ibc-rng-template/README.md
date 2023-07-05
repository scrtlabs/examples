### Hermes relayer - between secret testnet and juno testnet

1. start gm

```
gm start

```

2. check status

```
gm status

```

3. create clients

```
hermes create client --host-chain pulsar-2 --reference-chain uni-6
```

```
hermes create client --host-chain uni-6 --reference-chain pulsar-2
```

4. create connections

```
hermes create connection --a-chain uni-6 --a-client 07-tendermint-451 --b-client 07-tendermint-233

```

5. create channel identifier

```

hermes create channel --a-chain uni-6 --a-connection connection-591 --a-port wasm.juno18wa7vw84rwjgfej8vhqzhaampurj43uh24heaztcju9x7l6ph8vqzmkez2 --b-port wasm.secret1fn7v9r60u9rqgwwxmwn8hhe80ka055pultkd92

```

6. Start hermes

```

hermes start

```

7. execute the contract

```
junod tx wasm execute --from seanradJuno juno1wz2rn6tcnzu9p7ns2mgxyg6nl0q9gwzhsjrpwq7s7pua00z786ys4rpxe2 '{"do_something": {}}' --gas 300000 -y --chain-id uni-6 --node https://uni-rpc.reece.sh:443 --gas-prices 0.025ujunox

```

### Upload + Instantiate on Juno

1. upload the contract [here](https://test.juno.tools/contracts/upload/).

2. Instantiate the contract with this command:

```
junod tx wasm instantiate <codeId> '{"init": {"rand_provider": { "address": <contract address>, "code_hash": <contract code hash>}}}' --label 'ibc-consumer-template' --no-admin --from <your juno wallet> --gas 200000 -y --chain-id uni-6 --node https://uni-rpc.reece.sh:443 --gas-prices 0.025ujunox
```

3. query that the instantiation was successful:

```
junod q tx <transaction hash> --node https://uni-rpc.reece.sh:443
```

### Additional Commands:

Query the Juno smart contract:

```
junod query wasm contract-state smart <contract address> '{"last_random": {}}' --chain-id uni-6 --node https://uni-rpc.reece.sh:443
```

Clear hermes packets:

```
hermes clear packets --chain uni-6 --port wasm.juno18wa7vw84rwjgfej8vhqzhaampurj43uh24heaztcju9x7l6ph8vqzmkez2 --channel channel-468
```

### Smart Contract addresses:

Secret Proxy contract:

```
secret1fn7v9r60u9rqgwwxmwn8hhe80ka055pultkd92
```

Juno Proxy contract:

```
juno18wa7vw84rwjgfej8vhqzhaampurj43uh24heaztcju9x7l6ph8vqzmkez2
```

Juno Consumer contract:

```
juno1wz2rn6tcnzu9p7ns2mgxyg6nl0q9gwzhsjrpwq7s7pua00z786ys4rpxe2
```
