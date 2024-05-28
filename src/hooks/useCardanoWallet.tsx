import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import { getSupportedWallets } from '../utils/wallet-utils';

export interface IOptions {
  onConnect?: (walletName: string) => void;
  onConnectError?: (walletName: string, error: Error) => void;
}

export function useCardanoWallet(opts: IOptions) {
  const { onConnect, onConnectError } = opts;

  const supportedWallets = getSupportedWallets();

  const {
    isEnabled,
    isConnected,
    isConnecting,
    stakeAddress,
    usedAddresses,
    unusedAddresses,
    connect,
    disconnect,
    signMessage
  } = useCardano();

  const connectWallet = (walletName: string) => {
    const handleConnect = () => {
      onConnect?.(walletName);
    };
    const handleConnectError = (error: Error) => {
      onConnectError?.(walletName, error);
    };
    connect(walletName, handleConnect, handleConnectError);
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    isEnabled,
    isConnected,
    isConnecting,
    stakeAddress,
    unusedAddresses,
    usedAddresses,
    supportedWallets,
    signMessage,
    connectWallet,
    disconnectWallet
  };
}
