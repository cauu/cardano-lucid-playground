import { useMemo } from 'react';
import { Constr, Data } from 'lucid-cardano';

import { HelloWordHelloWorld } from '@/plutus';
import { useLucid } from '@/src/hooks/useLucid';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';

export const useValidators = () => {
  const { lucid, walletAddress } = useLucid();

  const publicKeyHash = useMemo(() => {
    if (!lucid || !walletAddress) return '';

    return lucid.utils.getAddressDetails(walletAddress).paymentCredential?.hash;
  }, [lucid, walletAddress]);

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
      if (!publicKeyHash) return;

      console.log('publicKeyHash', publicKeyHash);

      const datum = Data.to(new Constr(0, [publicKeyHash]));
      const utxos = await Promise.all(
        deployers.map((deployer) =>
          deployer.deploy({
            inline: datum
          })
        )
      );
      return utxos;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return {
    deployers,
    deploy
  };
};
