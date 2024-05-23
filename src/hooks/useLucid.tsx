import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Blockfrost, Lucid } from 'lucid-cardano';

import { BLOCKFORST_API_KEY } from '../constants/constant';

interface ILucidContext {
  lucid: Lucid | null;
}

const LucidContext = createContext<ILucidContext>({
  lucid: null
});

interface IProps {
  lucid: Lucid | null;
  children: ReactNode;
}

export function LucidProvider(props: IProps) {
  const { children } = props;

  const [lucid, setLucid] = useState<Lucid | null>(null);

  useEffect(() => {
    Lucid.new(new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', BLOCKFORST_API_KEY), 'Preprod').then(
      (_lucid) => {
        setLucid(_lucid);
      }
    );
  }, []);

  useEffect(() => {
    if (lucid) {
      /** Select wallet */
    }
  }, [lucid]);

  const value = useMemo(() => {
    return {
      lucid
    };
  }, [lucid]);

  return <LucidContext.Provider value={value}>{children}</LucidContext.Provider>;
}

export function useLucid() {
  const context = useContext(LucidContext);

  return context;
}
