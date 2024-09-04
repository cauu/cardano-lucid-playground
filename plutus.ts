import { applyParamsToScript, Data, Validator } from 'lucid-cardano';

export interface CounterPlus {
  new (): Validator;
  datum: { count: bigint };
  redeemer: Data;
}

export const CounterPlus = Object.assign(
  function () {
    return {
      type: 'PlutusV2',
      script:
        '5901d0010000323232323232322323232225333007323232533300a3370e900118059baa00113232533300c300a300d3754002264646464a66602066e1d200430113754002264646464a6660286024602a6ea80044c94ccc054cdc3a4008602c6ea80044c8c8cdc39bad300d3019375400466e00dd69806980c9baa00748008c04c004c068c05cdd50008b1803180b1baa3019301637540022c64a66602e0022980103d87a800013374a90001980c180c800a5eb80c8cc004004dd61803180b1baa00c22533301800114bd7009919299980b99baf300d3019375400400a2660360046600800800226600800800260380046034002601060286ea8c014c050dd50031807000980a98091baa00116300130113754600460226ea800c8c050c054c0540048c04cc050004c044c038dd50008b199119198008008019129998090008a60103d87a80001323253330113375e600e60266ea80080144cdd2a40006602a00497ae01330040040013016002301400137586002601a6ea800cc040c034dd5001118080008b18071807801180680098049baa00114984d958c00400c94ccc010c008c014dd500089919299980498060010a4c2c6eb4c028004c018dd50008b1b87480015cd2ab9d5573caae7d5d02ba15745'
    };
  },
  {
    datum: {
      title: 'CountDatum',
      anyOf: [
        { title: 'CountDatum', dataType: 'constructor', index: 0, fields: [{ dataType: 'integer', title: 'count' }] }
      ]
    }
  },
  { redeemer: { title: 'Data', description: 'Any Plutus data.' } }
) as unknown as CounterPlus;

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

export interface MintGuesswordMint {
  new (codeWord: string): Validator;
  redeemer: { guessedWord: string };
}

export const MintGuesswordMint = Object.assign(
  function (codeWord: string) {
    return {
      type: 'PlutusV2',
      script: applyParamsToScript(
        '5858010000323232323232232232253330063371e6eb8c028c020dd50018020a4c26caca66600866e1d20003005375400226464a66601260160042930b1bae3009001300637540022c6eb80055cd2ab9d5573caae7d5d0aba201',
        [codeWord],
        { dataType: 'list', items: [{ dataType: 'bytes' }] } as any
      )
    };
  },

  {
    redeemer: {
      title: 'CoolTokenRedeemer',
      anyOf: [
        {
          title: 'CoolTokenRedeemer',
          dataType: 'constructor',
          index: 0,
          fields: [{ dataType: 'bytes', title: 'guessedWord' }]
        }
      ]
    }
  }
) as unknown as MintGuesswordMint;

export interface OneshotGiftCard {
  new (tokenName: string, utxoRef: { transactionId: { hash: string }; outputIndex: bigint }): Validator;
  rdmr: 'CheckMint' | 'CheckBurn';
}

export const OneshotGiftCard = Object.assign(
  function (tokenName: string, utxoRef: { transactionId: { hash: string }; outputIndex: bigint }) {
    return {
      type: 'PlutusV2',
      script: applyParamsToScript(
        '58ad01000032323232323223222323225333008323232533300b3006300c3754002264646464a66601e601460206ea802c5288a513756602460266026602660260046eb0c044004c038dd50019bae300f300d37540022c601c601e004601a00260146ea80045261365632533300730020011533300a300937540062930b0a99980399b874800800454ccc028c024dd50018a4c2c2c600e6ea8008dc3a40006eb80055cd2ab9d5573caae7d5d0aba21',
        [tokenName, utxoRef],
        {
          dataType: 'list',
          items: [
            { dataType: 'bytes' },
            {
              title: 'OutputReference',
              description:
                'An `OutputReference` is a unique reference to an output on-chain. The `output_index`\n corresponds to the position in the output list of the transaction (identified by its id)\n that produced that output',
              anyOf: [
                {
                  title: 'OutputReference',
                  dataType: 'constructor',
                  index: 0,
                  fields: [
                    {
                      title: 'transactionId',
                      description:
                        "A unique transaction identifier, as the hash of a transaction body. Note that the transaction id\n isn't a direct hash of the `Transaction` as visible on-chain. Rather, they correspond to hash\n digests of transaction body as they are serialized on the network.",
                      anyOf: [
                        {
                          title: 'TransactionId',
                          dataType: 'constructor',
                          index: 0,
                          fields: [{ dataType: 'bytes', title: 'hash' }]
                        }
                      ]
                    },
                    { dataType: 'integer', title: 'outputIndex' }
                  ]
                }
              ]
            }
          ]
        } as any
      )
    };
  },

  {
    rdmr: {
      title: 'Action',
      anyOf: [
        { title: 'CheckMint', dataType: 'constructor', index: 0, fields: [] },
        { title: 'CheckBurn', dataType: 'constructor', index: 1, fields: [] }
      ]
    }
  }
) as unknown as OneshotGiftCard;

export interface SimplestMintSimplestMint {
  new (): Validator;
  _rdmr: Data;
}

export const SimplestMintSimplestMint = Object.assign(
  function () {
    return { type: 'PlutusV2', script: '51010000322253330034a229309b2b2b9a01' };
  },

  { _rdmr: { title: 'Data', description: 'Any Plutus data.' } }
) as unknown as SimplestMintSimplestMint;

export interface StakeValidatorExampleSpend {
  new (): Validator;
  _datum: Data;
  _redeemer: { wrapper: Data };
}

export const StakeValidatorExampleSpend = Object.assign(
  function () {
    return {
      type: 'PlutusV2',
      script:
        '590156010000323232323232322253330033370e900018021baa0011533300332323253330063370e900218039baa00113253330073370e900018041baa00113253330083370e900118049baa0011324a26eb8c034c028dd50008b180618049baa00116300b300837540022c601460160046012002600a6ea800452613656132253330053232323253330093370e900118051baa0011323322323300100100322533301100114a0264a66601e66ebc010c040c050008528899801801800980a0009bab300f3010301030103010301030100013374a900019807180298061baa300f300c375466446466002002006446464a66602066ebcc02cc048dd50010028980a980b18091baa002133004004001301500230130013758601e002601e60186ea80092f5c060166ea800858c034c038008c030004c020dd5001118058008a4c26cac6010600a6ea80055cd2ab9d5573caae7d5d02ba15745'
    };
  },
  { _datum: { title: 'Data', description: 'Any Plutus data.' } },
  {
    _redeemer: {
      title: 'Wrapped Redeemer',
      description: 'A redeemer wrapped in an extra constructor to make multi-validator detection possible on-chain.',
      anyOf: [{ dataType: 'constructor', index: 1, fields: [{ description: 'Any Plutus data.' }] }]
    }
  }
) as unknown as StakeValidatorExampleSpend;

export interface StakeValidatorExampleWithdraw {
  new (): Validator;
  redeemer: Data;
}

export const StakeValidatorExampleWithdraw = Object.assign(
  function () {
    return {
      type: 'PlutusV2',
      script:
        '590156010000323232323232322253330033370e900018021baa0011533300332323253330063370e900218039baa00113253330073370e900018041baa00113253330083370e900118049baa0011324a26eb8c034c028dd50008b180618049baa00116300b300837540022c601460160046012002600a6ea800452613656132253330053232323253330093370e900118051baa0011323322323300100100322533301100114a0264a66601e66ebc010c040c050008528899801801800980a0009bab300f3010301030103010301030100013374a900019807180298061baa300f300c375466446466002002006446464a66602066ebcc02cc048dd50010028980a980b18091baa002133004004001301500230130013758601e002601e60186ea80092f5c060166ea800858c034c038008c030004c020dd5001118058008a4c26cac6010600a6ea80055cd2ab9d5573caae7d5d02ba15745'
    };
  },

  { redeemer: { title: 'Data', description: 'Any Plutus data.' } }
) as unknown as StakeValidatorExampleWithdraw;

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
