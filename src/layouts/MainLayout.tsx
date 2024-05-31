import React from 'react';
// import { ConnectWalletList } from '@cardano-foundation/cardano-connect-with-wallet';
// import { UnavailableWalletVisibility } from '@cardano-foundation/cardano-connect-with-wallet-core';

// import { useCardanoWallet } from '../hooks/useCardanoWallet';
import { ConnectWalletButton } from '../components/ConnectWalletButton';

interface IProps {
  children?: React.ReactNode;
}

export const MainLayout = (props: IProps) => {
  const { children } = props;

  return (
    <div>
      <header className="flex justify-between items-center w-full border-b p-4">
        <a href="/" target="_blank">
          111
        </a>

        <ConnectWalletButton />
      </header>
      <main>{children}</main>

      {/* <ConnectWalletList showUnavailableWallets={UnavailableWalletVisibility.SHOW_UNAVAILABLE} /> */}
    </div>
  );
};
