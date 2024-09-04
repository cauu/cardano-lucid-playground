import { useMemo } from 'react';

import { SimplestMintSimplestMint } from '@/plutus';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { useLucid } from '@/src/hooks/useLucid';

export const useValidators = () => {
  const { lucid } = useLucid();

  const deployers = useMemo(() => {
    if (!lucid) return [];

    const simplestMintDeployer = new ValidatorDeployer(lucid, {
      script: new SimplestMintSimplestMint()
      //   datumMeta: SimplestMintSimplestMint._rdmr
    });

    return [simplestMintDeployer];
  }, [lucid]);

  const deploy = async (val: { [key: string]: number }) => {
    const assets: any = {};
    Object.keys(val).forEach((key) => {
      assets[key] = BigInt(val[key]);
    });
    const utxos = await Promise.all(deployers.map((deployer) => deployer.mint(assets)));

    return utxos;
  };

  return {
    deployers,
    utxos: [],
    isLoadingUtxos: false,
    refetchUtxos: () => {},
    deploy,
    unlock: () => {}
  };
};
