import React from 'react';

import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { SwitchNetworkButton } from '../components/SwitchNetworkButton';

interface IProps {
  children?: React.ReactNode;
}

export const MainLayout = (props: IProps) => {
  const { children } = props;

  return (
    <div className="flex flex-col h-[100vh]">
      <header className="flex justify-between items-center w-full border-b p-4">
        <a href="/" target="_blank" className="font-[600] text-xl">
          Cardano Playground
        </a>

        <div className="flex gap-2">
          <SwitchNetworkButton />
          <ConnectWalletButton />
        </div>
      </header>
      <main className="flex flex-1 px-6 py-4">{children}</main>

      {/* <ConnectWalletList showUnavailableWallets={UnavailableWalletVisibility.SHOW_UNAVAILABLE} /> */}
    </div>
  );
};
