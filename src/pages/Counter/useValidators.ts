import { useMemo } from 'react';
import { Data } from 'lucid-cardano';
import { useQuery } from '@tanstack/react-query';

import { CounterPlus } from '@/plutus';
import { useLucid } from '@/src/hooks/useLucid';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { IUTxO } from '@/src/common/type';

export const useValidators = () => {
  const { lucid, walletAddress } = useLucid();

  const publicKeyHash = useMemo(() => {
    if (!lucid || !walletAddress) return '';

    return lucid.utils.getAddressDetails(walletAddress).paymentCredential?.hash;
  }, [lucid, walletAddress]);

  const deployers = useMemo(() => {
    if (!lucid) return [];

    const countedDeployer = new ValidatorDeployer(lucid, {
      script: new CounterPlus(),
      datumMeta: CounterPlus.datum
      // redeemerMeta: CounterPlus.redeemer
    });

    if (publicKeyHash) {
      countedDeployer.setDefaultDatumValue(0, {
        count: 1
      });
    }

    return [countedDeployer];
  }, [lucid, publicKeyHash]);

  const {
    data: utxos,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['getUtxos', 'Counter', publicKeyHash],
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
              datumDecoded: {
                count: Data.from(
                  `${utxo.datum}`,
                  Data.Object({
                    count: Data.Integer()
                  })
                )?.count?.toString()
              }
            };
          })
      );
    }
  });

  const deploy = async (val: { count: number }) => {
    try {
      if (!val.count) {
        throw new Error('Count is required');
      }
      // if (!publicKeyHash) return;
      // const datum = Data.to(new Constr<any>(0, [val.counter]));
      const datum = Data.to<any>(
        {
          count: BigInt(val.count)
        },
        Data.Object({
          count: Data.Integer()
        })
      );

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

  const unlock = async (utxos: IUTxO[], redeemer: { count: number }) => {
    const scriptInconsistent = utxos.some((utxo) => !!utxo.scriptRef) && !utxos.every((utxo) => !!utxo.scriptRef);

    if (scriptInconsistent) {
      throw new Error('Script inconsistent');
    }

    console.log('utxos', utxos, redeemer);

    const datum = Data.to<any>(
      {
        count: BigInt(redeemer.count)
      },
      Data.Object({
        count: Data.Integer()
      })
    );

    const responseTxs = await Promise.all(
      deployers.map((deployer) =>
        deployer.unlock(utxos, Data.void(), (tx) => {
          if (utxos.every((utxo) => !!utxo.scriptRef)) {
            return tx.addSigner(walletAddress).payToAddressWithData(
              deployer.scriptAddress,
              {
                inline: datum
              },
              {}
            );
          }
          return tx.addSigner(walletAddress).attachSpendingValidator(deployer.script).payToAddressWithData(
            deployer.scriptAddress,
            {
              inline: datum
            },
            {}
          );
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
