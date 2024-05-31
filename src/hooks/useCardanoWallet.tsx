import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import { getSupportedWallets } from '../utils/wallet-utils';

export interface IOptions {
  //   onConnect?: (walletName: string) => void;
  //   onConnectError?: (walletName: string, error: Error) => void;
}

export function useCardanoWallet() {
  //   const { onConnect, onConnectError } = opts;

  const supportedWallets = getSupportedWallets();

  const {
    isEnabled,
    isConnected,
    isConnecting,
    stakeAddress,
    usedAddresses,
    unusedAddresses,
    enabledWallet,
    connect,
    disconnect,
    signMessage
  } = useCardano();

  return {
    isEnabled,
    isConnected,
    isConnecting,
    stakeAddress,
    unusedAddresses,
    usedAddresses,
    supportedWallets,
    signMessage,
    enabledWallet,
    connect,
    disconnect
  };
}
