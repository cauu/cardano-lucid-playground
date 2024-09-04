### Vite compatible issue
Vite will move all the esmodule dependencies into .deps folder in development mode, but *lucid-cardano* uses *fetch* to dyamic load lucid-cardano/esm/src/core/libs/cardano_message_signing/cardano_message_signing_bg.wasm and lucid-cardano/esm/src/core/libs/cardano_multiplatform_lib_bg/cardano_multiplatform_lib_bg.wasm in runtime, which will not be served in .deps folders.

In order to fix this, i forked *lucid-cardano* and replace those two files with cdn versions, so please using @cauu/lucid-cardano instead of the original one.

### Examples
https://github1s.com/vacuumlabs/cardano-ctf/blob/main/01_sell_nft/validators/nft.ak