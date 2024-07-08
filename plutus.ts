import { applyParamsToScript, Data, Validator } from 'lucid-cardano';

export interface HelloWordHelloWorld {
  new (): Validator;
  datum: { owner: string };
  redeemer: { msg: string };
}

export const HelloWordHelloWorld = Object.assign(
  function () {
    return {
      type: 'PlutusV2',
      script:
        '58e901000032323232323223223225333006323253330083371e6eb8c008c028dd5002a4410d48656c6c6f2c20576f726c642100100114a06644646600200200644a66601c00229404c94ccc030cdc79bae301000200414a226600600600260200026eb0c02cc030c030c030c030c030c030c030c030c024dd5180098049baa002375c600260126ea80188c02c0045261365653330043370e900018029baa001132325333009300b002149858dd7180480098031baa0011653330023370e900018019baa0011323253330073009002149858dd7180380098021baa001165734aae7555cf2ab9f5742ae881'
    };
  },
  {
    datum: {
      title: 'Datum',
      anyOf: [{ title: 'Datum', dataType: 'constructor', index: 0, fields: [{ dataType: 'bytes', title: 'owner' }] }]
    }
  },
  {
    redeemer: {
      title: 'Redeemer',
      anyOf: [{ title: 'Redeemer', dataType: 'constructor', index: 0, fields: [{ dataType: 'bytes', title: 'msg' }] }]
    }
  }
) as unknown as HelloWordHelloWorld;

export interface VestingVesting {
  new (): Validator;
  datum: { lockUntil: bigint; owner: string; beneficiary: string };
  _redeemer: undefined;
}

export const VestingVesting = Object.assign(
  function () {
    return {
      type: 'PlutusV2',
      script:
        '590163010000323232323232232232253330063253330073370e900118041baa30013009375400426464a66601266002600460166ea8010dd7180198059baa00814a22a66601266002600460166ea8010dd718069807180718059baa0081332232533300c3370e900118069baa0011337120046eb4c040c038dd50008a503004300d37546008601a6ea8008c034c038c038c038c038c038c038c038c02cdd5180118059baa004375a600460166ea80205281119198008009bac300f30103010301030103010301030103010300d375400644a66601e00229404c94ccc034cdc79bae301100200414a226600600600260220024601800229408c02cc030004526136563253330053370e900018030008a99980418038008a4c2c2c6ea80054ccc008cdc3a400060066ea80044c8c8c8c8c8c94ccc02cc03400852616375c601600260160046eb8c024004c024008dd6980380098021baa001165734aae7555cf2ab9f5742ae89'
    };
  },
  {
    datum: {
      title: 'Datum',
      anyOf: [
        {
          title: 'Datum',
          dataType: 'constructor',
          index: 0,
          fields: [
            { dataType: 'integer', title: 'lockUntil' },
            { dataType: 'bytes', title: 'owner' },
            { dataType: 'bytes', title: 'beneficiary' }
          ]
        }
      ]
    }
  },
  {
    _redeemer: {
      title: 'Unit',
      description: 'The nullary constructor.',
      anyOf: [{ dataType: 'constructor', index: 0, fields: [] }]
    }
  }
) as unknown as VestingVesting;
