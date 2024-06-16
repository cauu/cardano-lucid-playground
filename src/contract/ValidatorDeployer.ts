import { Lucid, OutputData, Script, UTxO, toScriptRef } from 'lucid-cardano';
import { IDatumMeta, IRedeemerMeta } from '../common/type';

export class ValidatorDeployer {
  lucid: Lucid;

  script: Script;

  params: any;

  datumMeta: IDatumMeta;

  redeemerMeta: IRedeemerMeta;

  constructor(
    lucid: Lucid,
    validator: {
      script: Script;
      datumMeta: any;
      redeemerMeta: any;
      params?: any;
    }
  ) {
    const { script, datumMeta, redeemerMeta, params } = validator;
    this.lucid = lucid;
    this.script = script;
    this.params = params;
    this.datumMeta = datumMeta;
    this.redeemerMeta = redeemerMeta;
  }

  async deploy(outputData?: OutputData) {
    const validatorAddress = this.lucid.utils.validatorToAddress(this.script);

    console.log('datums', {
      scriptRef: this.script,
      ...(outputData || {})
    });

    const tx = await this.lucid
      .newTx()
      .payToContract(
        validatorAddress,
        {
          scriptRef: this.script,
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
      return o.script_ref?.PlutusScriptV2 === toScriptRef(this.script).to_js_value().PlutusScriptV2;
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
      scriptRef: this.script
    };

    return newUtxo;
  }
}
