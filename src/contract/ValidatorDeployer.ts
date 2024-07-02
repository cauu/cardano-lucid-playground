import { Lucid, OutputData, Script, Tx, UTxO, toScriptRef } from 'lucid-cardano';
import { IDatumMeta, IRedeemerMeta } from '../common/type';

const DEFAULT_VALUE_MAPPING: any = {
  bytes: '',
  integer: 0
};

export class ValidatorDeployer {
  lucid: Lucid;

  script: Script;

  scriptAddress: string;

  params: any;

  datumMeta: IDatumMeta;

  redeemerMeta: IRedeemerMeta;

  defaultDatumValue?: {
    [index: number]: string;
  };

  defaultRedeemerValue?: {
    [index: number]: string;
  };

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

    this.scriptAddress = lucid.utils.validatorToAddress(script);
    this.defaultDatumValue = this.initDefaultValue(datumMeta);
    this.defaultRedeemerValue = this.initDefaultValue(redeemerMeta);
  }

  initDefaultValue(schema: any) {
    const groups = schema.anyOf;

    const values: any = {};

    groups.forEach((group: any) => {
      const index = group.index;

      values[index] = group?.fields.reduce((acc: any, field: any) => {
        acc[field.title] = `${DEFAULT_VALUE_MAPPING[field.dataType]}`;
        return acc;
      }, {});
    });

    return values;
  }

  getDefaultDatumValue(index: number) {
    return this.defaultDatumValue?.[index];
  }

  getDefaultRedeemerValue(index: number) {
    return this.defaultRedeemerValue?.[index];
  }

  setDefaultDatumValue(index: number, value: any) {
    if (!this.defaultDatumValue) {
      this.defaultDatumValue = {};
    }

    this.defaultDatumValue[index] = value;
  }

  setDefaultRedeemerValue(index: number, value: any) {
    if (!this.defaultRedeemerValue) {
      this.defaultRedeemerValue = {};
    }

    this.defaultRedeemerValue[index] = value;
  }

  async getUtxos() {
    return await this.lucid.utxosAt(this.scriptAddress);
  }

  async deploy(outputData?: OutputData) {
    const validatorAddress = this.lucid.utils.validatorToAddress(this.script);

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

  async unlock(_utxos: UTxO[], redeemer: any, processTx?: (tx: Tx) => Tx) {
    /**
     * There are 4 types of validators:
     * 1. publish validator
     * 2. mint validator
     * 3. spending validator
     * 4. withdraw validator
     */
    const utxos = await this.lucid.utxosByOutRef([
      {
        txHash: _utxos[0].txHash,
        outputIndex: _utxos[0].outputIndex
      }
    ]);

    let tx = await this.lucid.newTx();

    tx.collectFrom(utxos, redeemer);

    tx = processTx?.(tx) || tx;

    // const tx = await this.lucid
    //   .newTx()
    //   .collectFrom([utxo], redeemer)
    //   .addSigner(await this.lucid.wallet.address())
    //   .attachSpendingValidator(this.script)
    //   .complete();

    const signedTx = await (await tx.complete()).sign().complete();

    console.log('unlock4', signedTx);

    return signedTx.submit();
  }
}
