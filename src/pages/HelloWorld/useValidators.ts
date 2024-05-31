import { useMemo } from 'react';

import { HelloWordHelloWorld } from '@/plutus';
import { useLucid } from '@/src/hooks/useLucid';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';

export const useValidators = () => {
  const { lucid } = useLucid();

  const deployers = useMemo(() => {
    if (!lucid) return [];

    return [
      new ValidatorDeployer(lucid, {
        script: new HelloWordHelloWorld(),
        datumMeta: HelloWordHelloWorld.datum,
        redeemerMeta: HelloWordHelloWorld.redeemer
      })
    ];
  }, [lucid]);

  const deploy = async () => {
    try {
      console.log('deploystart', lucid);
      const utxos = await Promise.all(deployers.map((deployer) => deployer.deploy()));
      console.log('deployend');
      return utxos;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return {
    deploy
  };
};
