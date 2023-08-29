##### Fund Hermes Wallets

To fund hermes wallets for both LocalSecret containers, run the following: 

```
hermes keys add --hd-path "m/44'/529'/0'/0/0" --mnemonic-file a.mnemonic --chain secretdev-1
hermes keys add --hd-path "m/44'/529'/0'/0/0" --mnemonic-file a.mnemonic --chain secretdev-2
```

- Query Hermes wallet balances: 

```
hermes keys balance --chain secretdev-1
hermes keys balance --chain secretdev-2
```

##### Fund SecretCLI Wallets

- Add wallets to secretCLI: 

Install SecretCLI and then run the following: 
```secretcli keys add --recover a```

You will be asked for the seed recovery mnemonic, which is: 

grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar

- Query wallet balances: 

##### SecretCLI wallet balance query
secretcli query bank balances "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03"

##### secretdev-1 wallet query
secretcli config node http://localhost:26657
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03

##### secretdev-2 wallet query
secretcli config node http://localhost:36657
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03
