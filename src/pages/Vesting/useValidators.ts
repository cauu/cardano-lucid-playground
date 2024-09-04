import { useMemo } from 'react';
import { Data } from 'lucid-cardano';
import { useQuery } from '@tanstack/react-query';

import { VestingVesting } from '@/plutus';
import { useLucid } from '@/src/hooks/useLucid';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { IUTxO } from '@/src/common/type';

export const useValidators = () => {
  const { lucid, walletAddress } = useLucid();

  const ownerPublicKeyHash = useMemo(() => {
    if (!lucid || !walletAddress) return '';

    return lucid.utils.getAddressDetails(walletAddress).paymentCredential?.hash;
  }, [lucid, walletAddress]);

  const deployers = useMemo(() => {
    if (!lucid) return [];

    const vestingDeployer = new ValidatorDeployer(lucid, {
      script: new VestingVesting(),
      datumMeta: VestingVesting.datum,
      redeemerMeta: VestingVesting._redeemer
    });

    if (ownerPublicKeyHash) {
      vestingDeployer.setDefaultDatumValue(0, {
        owner: ownerPublicKeyHash,
        beneficiary: '',
        lock_until: new Date('2024-07-08 13:00:00').getTime()
      });
    }

    return [vestingDeployer];
  }, [lucid, ownerPublicKeyHash]);

  const Datum = Data.Object({
    lock_until: Data.Integer(),
    owner: Data.Bytes(),
    beneficiary: Data.Bytes()
  });

  const {
    data: utxos,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['getUtxos', 'Vesting', ownerPublicKeyHash],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await deployers[0].getUtxos())
        .filter((utxo) => {
          try {
            return (Data.from(`${utxo.datum}` || '', Datum) as any)?.owner === ownerPublicKeyHash;
          } catch (e) {
            return false;
          }
        })
        .map((utxo) => {
          const val = Data.from(`${utxo.datum}`, Datum);
          val.lock_until = Number(val.lock_until);

          return {
            ...utxo,
            datumDecoded: val
          };
        });
    }
  });

  const deploy = async (val: { lock_until: string; owner: string; beneficiary: string }) => {
    const datum = Data.to<any>(
      {
        lock_until: BigInt(val.lock_until),
        owner: val.owner,
        beneficiary: val.beneficiary
      },
      Data.Object({
        lock_until: Data.Integer(),
        owner: Data.Bytes(),
        beneficiary: Data.Bytes()
      })
    );

    const utxos = await Promise.all(
      deployers.map((deployer) =>
        deployer.deploy(
          {
            inline: datum
          },
          {
            lovelace: 1000000n
          }
        )
      )
    );

    return utxos;
  };

  const unlock = async (utxos: IUTxO[]) => {
    const redeemer = Data.void();

    const scriptInconsistent = utxos.some((utxo) => !!utxo.scriptRef) && !utxos.every((utxo) => !!utxo.scriptRef);

    if (scriptInconsistent) {
      throw new Error('Script inconsistent');
    }

    const currentTime = new Date().getTime();

    const laterTime = new Date(currentTime + 2 * 60 * 60 * 1000).getTime(); // add two hours (TTL: time to live)

    const responseTxs = await Promise.all(
      deployers.map((deployer) =>
        deployer.unlock(utxos, redeemer, (tx) => {
          if (utxos.every((utxo) => !!utxo.scriptRef)) {
            return tx.addSigner(walletAddress).validFrom(currentTime).validTo(laterTime);
          }
          return tx
            .addSigner(walletAddress)
            .validFrom(currentTime)
            .validTo(laterTime)
            .attachSpendingValidator(deployer.script);
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
