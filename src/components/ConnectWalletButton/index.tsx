import { Button, Drawer, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import { useSnackbar } from 'notistack';

import { useCardanoWallet } from '@/src/hooks/useCardanoWallet';
import { shortenWalletAddress } from '@/src/utils/wallet-utils';

export const ConnectWalletButton = () => {
  const { supportedWallets, usedAddresses, connect, disconnect } = useCardanoWallet();
  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showWalletList, setShowWalletList] = useState(false);
  const [showUninstalledWallets, setShowUninstalledWallets] = useState(false);

  const openMenu = Boolean(anchorEl);

  const handleConnect = (walletName: string) => {
    const onConnect = () => {
      setShowWalletList(false);
      setAnchorEl(null);
      setShowUninstalledWallets(false);
    };
    const onConnectError = (e: Error) => {
      enqueueSnackbar(e.message, { variant: 'error' });
      console.error(e);
    };
    connect(walletName, onConnect, onConnectError);
  };

  const handleDisconnect = () => {
    disconnect();
    setAnchorEl(null);
  };

  const handleShowConnectWallet = () => {
    setShowWalletList(true);
  };

  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const installedWallets = (supportedWallets || []).filter((wallet) => wallet.isInstalled);

  const uninstallWallets = (supportedWallets || []).filter((wallet) => !wallet.isInstalled);

  const walletAddress = usedAddresses && usedAddresses.length ? usedAddresses[0] : '';

  return (
    <>
      {walletAddress ? (
        <div>
          <Button variant="outlined" onClick={handleShowMenu}>
            {shortenWalletAddress(walletAddress, 'shorter')}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleDisconnect}>Disconnect Wallet</MenuItem>
          </Menu>
        </div>
      ) : (
        <Button variant="outlined" onClick={handleShowConnectWallet}>
          Connect Wallet
        </Button>
      )}

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
                  onClick={() => handleConnect?.(wallet.name)}
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
