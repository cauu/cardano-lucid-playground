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

    const helloWorldDeployer = new ValidatorDeployer(lucid, {
      script: new HelloWordHelloWorld(),
      datumMeta: HelloWordHelloWorld.datum,
      redeemerMeta: HelloWordHelloWorld.redeemer
    });

    if (publicKeyHash) {
      helloWorldDeployer.setDefaultDatumValue(0, {
        owner: publicKeyHash
      });
    }

    return [helloWorldDeployer];
  }, [lucid, publicKeyHash]);

  const deploy = async (val: { owner: string }) => {
    try {
      if (!val.owner) {
        throw new Error('Owner is required');
      }
      // if (!publicKeyHash) return;
      const datum = Data.to(new Constr(0, [val.owner]));
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
