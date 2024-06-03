import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Blockfrost, Lucid } from 'lucid-cardano';

import { BLOCKFORST_API_KEY } from '../common/constant';
import { useCardanoWallet } from './useCardanoWallet';

interface ILucidContext {
  walletAddress: string;
  lucid: Lucid | null;
}

const LucidContext = createContext<ILucidContext>({
  walletAddress: '',
  lucid: null
});

interface IProps {
  // lucid: Lucid | null;
  children: ReactNode;
}

export function LucidProvider(props: IProps) {
  const { children } = props;

  const { enabledWallet } = useCardanoWallet();

  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    if (!enabledWallet) return;

    console.log('BLOCKFORST_API_KEYBLOCKFORST_API_KEY', BLOCKFORST_API_KEY);

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

        lucid.wallet.address().then((address) => {
          setWalletAddress(address);
        });
      });
    }
  }, [lucid, enabledWallet]);

  const value = useMemo(() => {
    return {
      walletAddress,
      lucid
    };
  }, [walletAddress, lucid]);

  return <LucidContext.Provider value={value}>{children}</LucidContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLucid() {
  const context = useContext(LucidContext);

  return context;
}
