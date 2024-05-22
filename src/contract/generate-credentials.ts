import { Lucid } from "lucid-cardano";
import fs from "fs";

const lucid = await Lucid.new(undefined, "Preview");

const privateKey = lucid.utils.generatePrivateKey();

fs.writeFileSync("me.sk", privateKey);

const address = await lucid
  .selectWalletFromPrivateKey(privateKey)
  .wallet.address();

fs.writeFileSync("me.addr", address);
