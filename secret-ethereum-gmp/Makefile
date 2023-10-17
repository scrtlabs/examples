.PHONY: check
check:
	cargo check

.PHONY: clippy
clippy:
	cargo clippy

PHONY: test
test: unit-test

.PHONY: unit-test
unit-test:
	cargo unit-test

# This is a build suitable for uploading to mainnet.
# Calls to `debug_print` get removed by the compiler.
.PHONY: build-mainnet _build-mainnet
build-mainnet: _build-mainnet compress-wasm
_build-mainnet:
	RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown

.PHONY: compress-wasm
compress-wasm:
	cp ./target/wasm32-unknown-unknown/release/*.wasm ./contract.wasm
	@## The following line is not necessary, may work only on linux (extra size optimization)
	@# wasm-opt -Os ./contract.wasm -o ./contract.wasm
	cat ./contract.wasm | gzip -9 > ./contract.wasm.gz

.PHONY: schema
schema:
	cargo run --example schema

# Run local development chain with four funded accounts (named a, b, c, and d)
.PHONY: start-server
start-server: # CTRL+C to stop
	docker run -it --rm \
		-p 9091:9091 -p 26657:26657 -p 26656:26656 -p 1317:1317 -p 5000:5000 \
		-v $$(pwd):/root/code \
		--name secretdev ghcr.io/scrtlabs/localsecret:v1.6.0-rc.3

# This relies on running `start-server` in another console
# You can run other commands on the secretcli inside the dev image
# by using `docker exec secretdev secretcli`.
.PHONY: store-contract-local
store-contract-local:
	docker exec secretdev secretcli tx compute store -y --from a --gas 5000000 /root/code/contract.wasm.gz

.PHONY: intantiate-local
instantiate-local:
	docker exec secretdev secretcli tx compute instantiate 1 '{}' -y  --from a --gas 5000000 --label rps-game

.PHONY: cli-store-contract
cli-store-contract:
	secretd tx compute store -y --from a --gas 500000000 contract.wasm.gz

.PHONY: cli-instantiate
cli-instantiate:
	secretd tx compute instantiate 1 '{}' -y  --from a --gas 5000000 --label rps-game

.PHONY: clean
clean:
	cargo clean
	-rm -f ./contract.wasm ./contract.wasm.gz
