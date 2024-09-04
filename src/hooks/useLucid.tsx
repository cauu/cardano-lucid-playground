import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Blockfrost, Lucid } from 'lucid-cardano';

import { BLOCKFORST_API_KEY } from '../common/constant';
import { useCardanoWallet } from './useCardanoWallet';
import { NetworkType } from '@cardano-foundation/cardano-connect-with-wallet-core';

interface ILucidContext {
  walletAddress: string;
  rewardAddress: string;
  lucid: Lucid | null;
  networkType: NetworkType;
  switchNetwork: (_networkType: NetworkType) => void;
}

const LucidContext = createContext<ILucidContext>({
  walletAddress: '',
  rewardAddress: '',
  lucid: null,
  networkType: NetworkType.TESTNET,
  switchNetwork: () => {}
});

interface IProps {
  // lucid: Lucid | null;
  children: ReactNode;
}

export function LucidProvider(props: IProps) {
  const { children } = props;

  const { enabledWallet } = useCardanoWallet();

  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [networkType, setNetworkType] = useState<NetworkType>(NetworkType.TESTNET);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [rewardAddress, setRewardAddress] = useState<string>('');

  useEffect(() => {
    if (!enabledWallet) return;

    // Lucid.new(new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', BLOCKFORST_API_KEY), 'Preprod').then(
    Lucid.new(new Blockfrost('https://cardano-preview.blockfrost.io/api/v0', BLOCKFORST_API_KEY), 'Preview').then(
      (_lucid) => {
        setLucid(_lucid);
      }
    );
  }, [enabledWallet]);

  useEffect(() => {
    if (lucid && enabledWallet) {
      /** Select wallet */
      window.cardano[enabledWallet].enable().then((api) => {
        lucid.selectWallet(api);

        lucid.wallet.rewardAddress().then((address) => {
          if (address) {
            setRewardAddress(address);
          }
        });

        lucid.wallet.address().then((address) => {
          setWalletAddress(address);
        });
      });
    }
  }, [lucid, enabledWallet]);

  const switchNetwork = useCallback(
    (_networkType: NetworkType) => {
      setNetworkType(_networkType);
    },
    [setNetworkType]
  );

  const value = useMemo(() => {
    return {
      walletAddress,
      rewardAddress,
      lucid,
      networkType,
      switchNetwork
    };
  }, [walletAddress, lucid, networkType, switchNetwork, rewardAddress]);

  return <LucidContext.Provider value={value}>{children}</LucidContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLucid() {
  const context = useContext(LucidContext);

  return context;
}
