import { useMemo } from 'react';

import { MintGuesswordMint } from '@/plutus';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { useLucid } from '@/src/hooks/useLucid';
import { Data, fromText } from 'lucid-cardano';

export const useValidators = () => {
  const { lucid } = useLucid();

  const policyParams = 'hi';

  const deployers = useMemo(() => {
    if (!lucid) return [];

    const deployer = new ValidatorDeployer(lucid, {
      script: new MintGuesswordMint(fromText(policyParams)),
      redeemerMeta: MintGuesswordMint.redeemer
    });

    return [deployer];
  }, [lucid]);

  const mint = async (
    _assets: { [key: string]: number },
    redeemer: {
      guessedWord: string;
    }
  ) => {
    const assets: any = {};
    Object.keys(_assets).forEach((key) => {
      assets[key] = BigInt(_assets[key]);
    });
    const utxos = await Promise.all(
      deployers.map((deployer) =>
        deployer.mint(
          assets,
          Data.to(
            {
              guessedWord: fromText(redeemer.guessedWord)
            },
            MintGuesswordMint.redeemer
          )
        )
      )
    );

    return utxos;
  };

  return {
    policyParams,
    deployers,
    // utxos: [],
    // isLoadingUtxos: false,
    // refetchUtxos: () => {},
    mint
    // unlock: () => {}
  };
};
