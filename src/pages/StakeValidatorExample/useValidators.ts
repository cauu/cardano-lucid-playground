import { useMemo } from 'react';
import { Data } from 'lucid-cardano';
import { useQuery } from '@tanstack/react-query';

import { useLucid } from '@/src/hooks/useLucid';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { IUTxO } from '@/src/common/type';
// import { utf8ToHex } from '@/src/utils/utils';
// import { StakeValidatorExampleSpend, StakeValidatorExampleWithdraw } from '@/plutus';
import { StakeValidatorExampleSpend } from '@/plutus';

export const useValidators = () => {
  const { lucid, walletAddress } = useLucid();

  const publicKeyHash = useMemo(() => {
    if (!lucid || !walletAddress) return '';

    return lucid.utils.getAddressDetails(walletAddress).paymentCredential?.hash;
  }, [lucid, walletAddress]);

  const deployers = useMemo(() => {
    if (!lucid) return [];

    const deployer = new ValidatorDeployer(lucid, {
      script: new StakeValidatorExampleSpend()
    });

    // if (publicKeyHash) {
    //   deployer.setDefaultDatumValue(0, {
    //     owner: publicKeyHash
    //   });
    // }

    return [deployer];
  }, [lucid]);

  const {
    data: utxos,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['getUtxos', 'StakeValidatorExampleSpend', publicKeyHash],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (
        (await deployers[0].getUtxos())
          // .filter((utxo) => {
          //   try {
          //     return (Data.from(`${utxo.datum}` || '', Constr) as any)?.fields?.[0] === publicKeyHash;
          //   } catch (e) {
          //     return false;
          //   }
          // })
          .map((utxo) => {
            return {
              ...utxo,
              datumDecoded: ''
            };
          })
      );
    }
  });

  const deploy = async () => {
    try {
      const datum = Data.void();

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

  const unlock = async (utxos: IUTxO[]) => {
    try {
      const tx = await lucid
        ?.newTx()
        .attachSpendingValidator(new StakeValidatorExampleSpend())
        // .attachWithdrawalValidator(new StakeValidatorExampleWithdraw())
        .collectFrom(utxos || [], Data.void())
        // .withdraw(rewardAddress, 0n, Data.void())
        .complete();

      const signedTx = await tx?.sign().complete();
      const txHash = await signedTx?.submit();

      return txHash;
    } catch (e) {
      console.error(e);
      return [];
    }
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
