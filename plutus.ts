import { applyParamsToScript, Data, Validator } from "lucid-cardano";

export interface VestingVesting {
  new (): Validator;
  datum: { lockUntil: bigint; owner: string; beneficiary: string };
  _redeemer: undefined;
}

export const VestingVesting = Object.assign(
  function () {
    return {
      type: "PlutusV2",
      script:
        "590163010000323232323232232232253330063253330073370e900118041baa30013009375400426464a66601266002600460166ea8010dd7180198059baa00814a22a66601266002600460166ea8010dd718069807180718059baa0081332232533300c3370e900118069baa0011337120046eb4c040c038dd50008a503004300d37546008601a6ea8008c034c038c038c038c038c038c038c038c02cdd5180118059baa004375a600460166ea80205281119198008009bac300f30103010301030103010301030103010300d375400644a66601e00229404c94ccc034cdc79bae301100200414a226600600600260220024601800229408c02cc030004526136563253330053370e900018030008a99980418038008a4c2c2c6ea80054ccc008cdc3a400060066ea80044c8c8c8c8c8c94ccc02cc03400852616375c601600260160046eb8c024004c024008dd6980380098021baa001165734aae7555cf2ab9f5742ae89",
    };
  },
  {
    datum: {
      title: "Datum",
      anyOf: [
        {
          title: "Datum",
          dataType: "constructor",
          index: 0,
          fields: [
            { dataType: "integer", title: "lockUntil" },
            { dataType: "bytes", title: "owner" },
            { dataType: "bytes", title: "beneficiary" },
          ],
        },
      ],
    },
  },
  {
    _redeemer: {
      title: "Unit",
      description: "The nullary constructor.",
      anyOf: [{ dataType: "constructor", index: 0, fields: [] }],
    },
  }
) as unknown as VestingVesting;
