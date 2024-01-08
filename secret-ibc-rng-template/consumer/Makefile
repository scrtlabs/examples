.PHONY: check
check:
	cargo check

.PHONY: clippy
clippy:
	cargo clippy

# like build-mainnet, but slower and more deterministic
.PHONY: build-mainnet-reproducible
build-mainnet-reproducible:
	docker run --rm -v "$$(pwd)":/code \
          --mount type=volume,source="$$(basename "$$(pwd)")_cache",target=/code/target \
            --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
              cosmwasm/rust-optimizer:0.15.0

.PHONY: clean
clean:
	cargo clean
