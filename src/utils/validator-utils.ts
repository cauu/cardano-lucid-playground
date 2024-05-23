import { Lucid, OutputData, Script, UTxO, toScriptRef } from 'lucid-cardano';

type DeployedValidator = [string, UTxO];

async function deployValidator(key: string, lucid: Lucid, validator: Script, outputData?: OutputData) {
  const validatorAddress = lucid.utils.validatorToAddress(validator);

  const tx = await lucid
    .newTx()
    .payToContract(
      validatorAddress,
      {
        scriptRef: validator,
        inline: '0x9d',
        ...(outputData || {})
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
    return o.script_ref?.PlutusScriptV2 === toScriptRef(validator).to_js_value().PlutusScriptV2;
  });

  const newTxOutput = finalOutputs[newTxOutputIdx];

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  const newUtxo: UTxO = {
    address: newTxOutput.address,
    txHash,
    outputIndex: newTxOutputIdx,
    assets: {
      lovelace: BigInt(newTxOutput.amount.coin)
    },
    datumHash: newTxOutput.datumHash,
    datum: newTxOutput.datum,
    scriptRef: validator
  };

  const newValidator: DeployedValidator = [key, newUtxo];

  return newValidator;
}

export async function deployValidators(
  lucid: Lucid,
  validators: {
    script: Script;
    outputData: OutputData;
  }[]
) {
  const result = await Promise.all(
    Object.entries(validators).map(async ([key, validator]) => {
      const { script, outputData } = validator;
      const [name, utxo] = await deployValidator(key, lucid, script, outputData);

      return [
        name,
        {
          ...utxo,
          assets: {
            lovelace: utxo.assets.lovelace.toString()
          }
        }
      ];
    })
  );

  //   fs.writeFileSync('deployed-validators.json', JSON.stringify(result, null, 2));

  return result;
}
