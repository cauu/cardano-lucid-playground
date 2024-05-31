import { useEffect, useMemo, useState } from 'react';
import { Lucid, Blockfrost } from 'lucid-cardano';

import { HelloWordHelloWorld } from '@/plutus';

import { BLOCKFORST_API_KEY } from '@/src/common/constant';
import { useCardanoWallet } from '@/src/hooks/useCardanoWallet';

export const useValidators = () => {
  const [lucid, setLucid] = useState<Lucid>();

  const { enabledWallet } = useCardanoWallet();

  const validators = [HelloWordHelloWorld];

  console.log('xxxx', BLOCKFORST_API_KEY);

  useEffect(() => {
    if (!enabledWallet) return;

    Lucid.new(new Blockfrost('https://cardano-preview.blockfrost.io/api/v0', BLOCKFORST_API_KEY), 'Preview').then(
      async (_lucid) => {
        // const api = await window.cardano[enabledWallet].enable();
        // console.log('xxxx222', api);
        // _lucid.selectWallet(api);
        // console.log('setlucid', _lucid, api, enabledWallet);
        // setLucid(_lucid);
      }
    );
  }, [enabledWallet]);
};
