import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import { useEffect } from 'react';

export const HelloWorld = () => {
  const { enabledWallet, installedExtensions } = useCardano();

  console.log('enabled', enabledWallet, installedExtensions);

  return <div>Hello World</div>;
};
