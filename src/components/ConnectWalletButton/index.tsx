import { Button, Drawer } from '@mui/material';
import { useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';

import { WalletInfo } from '@/src/common/type';

interface IProps {
  supportedWallets: readonly WalletInfo[];
}

export const ConnectWalletButton = (props: IProps) => {
  const { supportedWallets } = props;

  const [showWalletList, setShowWalletList] = useState(false);
  const [showUninstalledWallets, setShowUninstalledWallets] = useState(false);

  const handleConnectWallet = () => {
    setShowWalletList(true);
  };

  const installedWallets = (supportedWallets || []).filter((wallet) => wallet.isInstalled);

  const uninstallWallets = (supportedWallets || []).filter((wallet) => !wallet.isInstalled);

  return (
    <>
      <Button onClick={handleConnectWallet}>Connect Wallet</Button>

      <Drawer anchor="right" open={showWalletList} onClose={() => setShowWalletList(false)}>
        <div className="px-4 py-6 w-96">
          <h3 className="m-0 font-lexend text-inherit text-lg sm:text-2xl md:text-2xl font-medium mb-8 font-[600]">
            Connect Wallet
          </h3>

          <div className="flex flex-col gap-2">
            {(installedWallets || []).map((wallet) => {
              return (
                <Button
                  variant="outlined"
                  className="w-full !justify-start !px-4 !py-3 !text-sm !border-gray-300 !text-gray-900"
                >
                  <div className="flex items-center">
                    <img src={wallet.icon} className="h-6 w-6" />
                    <div className="ml-1">{wallet.name}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          {uninstallWallets &&
            uninstallWallets.length &&
            (showUninstalledWallets ? (
              <div>
                <div className="m-0 font-lexend text-inherit text-xs sm:text-sm font-light mb-2 block mt-4">
                  Select a wallet to install it
                </div>
                <div className="flex flex-col gap-2">
                  {(uninstallWallets || []).map((wallet) => {
                    return (
                      <Button
                        variant="outlined"
                        className="w-full !justify-start !px-4 !py-3 !text-sm !border-gray-300 !text-gray-900 !bg-[#f9fafb] hover:bg-[#f9fafb]"
                        onClick={() => {
                          window.open(wallet.extensionUrl, '_blank');
                        }}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <img src={wallet.icon} className="h-6 w-6 " />
                            <div className="ml-1">{wallet.name}</div>
                          </div>

                          <div>
                            {wallet.isMobile && <div>Mobile Supported</div>}
                            <div>
                              <LaunchIcon
                                classes={{
                                  root: '!h-[16px] text-blue-500'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                <div>
                  <Button onClick={() => setShowUninstalledWallets(false)}>Show less</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowUninstalledWallets(true)}>{`Show more(${uninstallWallets.length})`}</Button>
            ))}
        </div>
      </Drawer>
    </>
  );
};
