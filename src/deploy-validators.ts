import fs from "fs";
import {
  Blockfrost,
  Constr,
  Data,
  Lucid,
  OutputData,
  Script,
  UTxO,
  toScriptRef,
} from "lucid-cardano";

import { PRIVATE_KEY, BLOCKFORST_API_KEY } from "./constant";
import { collectValidators } from "./collect-validators";

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    BLOCKFORST_API_KEY
  ),
  "Preview"
);

lucid.selectWalletFromPrivateKey(PRIVATE_KEY);

const publicKeyHash = lucid.utils.getAddressDetails(
  await lucid.wallet.address()
).paymentCredential?.hash;

type DeployedValidator = [string, UTxO];

/**
 * 1. collectValidators：从plutus.ts中收集所有的validator
 * 2. deployValidators one-by-one：部署所有的validator
 */

async function deployValidator(
  key: string,
  lucid: Lucid,
  validator: Script,
  outputData?: OutputData
) {
  const validatorAddress = lucid.utils.validatorToAddress(validator);

  const tx = await lucid
    .newTx()
    .payToContract(
      validatorAddress,
      {
        scriptRef: validator,
        inline: "0x9d",
        ...(outputData || {}),
      },
      /**
       * @QA
       *  Last argument used for?
       * How may assets is locked into this validator
       **/
      {}
    )
    .complete();

  const finalOutputs = tx.txComplete.to_js_value().body.outputs;

  const newTxOutputIdx = finalOutputs.findIndex((o: any) => {
    if (!o.script_ref) return false;
    return (
      o.script_ref?.PlutusScriptV2 ===
      toScriptRef(validator).to_js_value().PlutusScriptV2
    );
  });

  const newTxOutput = finalOutputs[newTxOutputIdx];

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  const newUtxo: UTxO = {
    address: newTxOutput.address,
    txHash,
    outputIndex: newTxOutputIdx,
    assets: {
      lovelace: BigInt(newTxOutput.amount.coin),
    },
    datumHash: newTxOutput.datumHash,
    datum: newTxOutput.datum,
    scriptRef: validator,
  };

  const newValidator: DeployedValidator = [key, newUtxo];

  return newValidator;
}

export async function deployValidators() {
  const validators = collectValidators(lucid);

  const datum = {
    inline: publicKeyHash ? Data.to(new Constr(0, [publicKeyHash])) : "",
  };

  const result = await Promise.all(
    Object.entries(validators).map(async ([key, validator]) => {
      const [name, utxo] = await deployValidator(key, lucid, validator, datum);

      return [
        name,
        {
          ...utxo,
          assets: {
            lovelace: utxo.assets.lovelace.toString(),
          },
        },
      ];
    })
  );

  fs.writeFileSync("deployed-validators.json", JSON.stringify(result, null, 2));

  return result;
}
