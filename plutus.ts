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
  datum: {
    lockUntil: bigint;
    owner: string;
    beneficiary: string;
    testdatum: {
      lockUntil: {
        lowerBound: { boundType: 'NegativeInfinity' | { Finite: [bigint] } | 'PositiveInfinity'; isInclusive: boolean };
        upperBound: { boundType: 'NegativeInfinity' | { Finite: [bigint] } | 'PositiveInfinity'; isInclusive: boolean };
      };
      owner: string;
      beneficiary: string;
    };
  };
  _redeemer: undefined;
}

export const VestingVesting = Object.assign(
  function () {
    return {
      type: 'PlutusV2',
      script:
        '5902760100003232323232322323232232253330083253330093007300a3754600260166ea80084c8c94ccc02ccc004c008c034dd50021bae3003300d3754014294454ccc02ccc004c008c034dd50021bae300f30103010300d37540142664464a66601c6018601e6ea80044cdc48011bad3012301037540022940c010c03cdd5180218079baa002300f3010301030103010301030103010300d37546004601a6ea8010dd6980118069baa00a14a04464660020026eb0c044c048c048c048c048c048c048c048c048c03cdd50019129998088008a50132533300f3371e6eb8c04c0080105288998018018009809800918070008a502300d300e00114984d958c94ccc01cc010c02000454ccc028c0240045261616375400264a66600a6004600c6ea80104c8c8c8c8c8c8c8c94ccc040c0480084c926533300d300a300e37540022646464646464a66602c60300042649329998099808180a1baa005132323232533301a301c00213232498c050008c04c00c58c068004c068008c060004c054dd50028b0b1bae30160013016002375c602800260280046024002601e6ea80045858c040004c040008dd7180700098070011bae300c001300c002375a6014002600e6ea80105894ccc014c008c018dd50008991919192999806180700109924c64a666014600e0022a66601a60186ea8010526161533300a300800113232533300f3011002149858dd6980780098061baa0041533300a3370e90020008a99980698061baa00414985858c028dd50018b19299980618058008a999804980398050008a51153330093006300a00114a02c2c6ea8c030004c030008c028004c01cdd50008b1b8748000dc3a4004ae6955ceaab9e5573eae855d11'
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
            { dataType: 'bytes', title: 'beneficiary' },
            {
              title: 'testdatum',
              anyOf: [
                {
                  title: 'TestDatum',
                  dataType: 'constructor',
                  index: 0,
                  fields: [
                    {
                      title: 'lockUntil',
                      description:
                        'A type to represent intervals of values. Interval are inhabited by a type\n `a` which is useful for non-infinite intervals that have a finite\n lower-bound and/or upper-bound.\n\n This allows to represent all kind of mathematical intervals:\n\n ```aiken\n // [1; 10]\n let i0: Interval<PosixTime> = Interval\n   { lower_bound:\n       IntervalBound { bound_type: Finite(1), is_inclusive: True }\n   , upper_bound:\n       IntervalBound { bound_type: Finite(10), is_inclusive: True }\n   }\n ```\n\n ```aiken\n // (20; infinity)\n let i1: Interval<PosixTime> = Interval\n   { lower_bound:\n       IntervalBound { bound_type: Finite(20), is_inclusive: False }\n   , upper_bound:\n       IntervalBound { bound_type: PositiveInfinity, is_inclusive: False }\n   }\n ```',
                      anyOf: [
                        {
                          title: 'Interval',
                          dataType: 'constructor',
                          index: 0,
                          fields: [
                            {
                              title: 'lowerBound',
                              description: 'An interval bound, either inclusive or exclusive.',
                              anyOf: [
                                {
                                  title: 'IntervalBound',
                                  dataType: 'constructor',
                                  index: 0,
                                  fields: [
                                    {
                                      title: 'boundType',
                                      description:
                                        'A type of interval bound. Where finite, a value of type `a` must be\n provided. `a` will typically be an `Int`, representing a number of seconds or\n milliseconds.',
                                      anyOf: [
                                        { title: 'NegativeInfinity', dataType: 'constructor', index: 0, fields: [] },
                                        {
                                          title: 'Finite',
                                          dataType: 'constructor',
                                          index: 1,
                                          fields: [{ dataType: 'integer' }]
                                        },
                                        { title: 'PositiveInfinity', dataType: 'constructor', index: 2, fields: [] }
                                      ]
                                    },
                                    {
                                      title: 'isInclusive',
                                      anyOf: [
                                        { title: 'False', dataType: 'constructor', index: 0, fields: [] },
                                        { title: 'True', dataType: 'constructor', index: 1, fields: [] }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              title: 'upperBound',
                              description: 'An interval bound, either inclusive or exclusive.',
                              anyOf: [
                                {
                                  title: 'IntervalBound',
                                  dataType: 'constructor',
                                  index: 0,
                                  fields: [
                                    {
                                      title: 'boundType',
                                      description:
                                        'A type of interval bound. Where finite, a value of type `a` must be\n provided. `a` will typically be an `Int`, representing a number of seconds or\n milliseconds.',
                                      anyOf: [
                                        { title: 'NegativeInfinity', dataType: 'constructor', index: 0, fields: [] },
                                        {
                                          title: 'Finite',
                                          dataType: 'constructor',
                                          index: 1,
                                          fields: [{ dataType: 'integer' }]
                                        },
                                        { title: 'PositiveInfinity', dataType: 'constructor', index: 2, fields: [] }
                                      ]
                                    },
                                    {
                                      title: 'isInclusive',
                                      anyOf: [
                                        { title: 'False', dataType: 'constructor', index: 0, fields: [] },
                                        { title: 'True', dataType: 'constructor', index: 1, fields: [] }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    { dataType: 'bytes', title: 'owner' },
                    { dataType: 'bytes', title: 'beneficiary' }
                  ]
                }
              ]
            }
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
