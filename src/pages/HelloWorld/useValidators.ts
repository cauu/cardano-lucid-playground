import { useMemo } from 'react';
import { Constr, Data } from 'lucid-cardano';
import { useQuery } from '@tanstack/react-query';

import { HelloWordHelloWorld } from '@/plutus';
import { useLucid } from '@/src/hooks/useLucid';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { IUTxO } from '@/src/common/type';
import { utf8ToHex } from '@/src/utils/utils';

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

  const {
    data: utxos,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['getUtxos', 'HelloWorld', publicKeyHash],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await deployers[0].getUtxos())
        .filter((utxo) => {
          try {
            return (Data.from(`${utxo.datum}` || '', Constr) as any)?.fields?.[0] === publicKeyHash;
          } catch (e) {
            return false;
          }
        })
        .map((utxo) => {
          return {
            ...utxo,
            datumDecoded: Data.from(`${utxo.datum}`, Constr)
          };
        });
    }
  });

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

  const unlock = async (utxos: IUTxO[], redeemer: { msg: string }) => {
    const redeemerData = Data.to(new Constr(0, [utf8ToHex(redeemer.msg)]));

    const scriptInconsistent = utxos.some((utxo) => !!utxo.scriptRef) && !utxos.every((utxo) => !!utxo.scriptRef);

    if (scriptInconsistent) {
      throw new Error('Script inconsistent');
    }

    const responseTxs = await Promise.all(
      deployers.map((deployer) =>
        deployer.unlock(utxos, redeemerData, (tx) => {
          if (utxos.every((utxo) => !!utxo.scriptRef)) {
            return tx.addSigner(walletAddress);
          }
          return tx.addSigner(walletAddress).attachSpendingValidator(deployer.script);
          // .attachSpendingValidator(deployer.script);
        })
      )
    );

    return responseTxs;
  };

  return {
    deployers,
    utxos,
    isLoadingUtxos: isLoading || isRefetching,
    refetchUtxos: refetch,
    deploy,
    unlock
  };
};
