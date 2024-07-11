import { useMemo, useState } from 'react';
import { useValidators } from './useValidators';

import { MintView } from '@/src/components/ValidatorViewer';

export const MintByGuessword = () => {
  const { policyParams, deployers, mint } = useValidators();

  const [redeemerVal, setRedeemerVal] = useState('');
  const [assets, setAssets] = useState('');

  const redeemerSchema = useMemo(() => {
    return deployers?.[0].redeemerMeta;
  }, [deployers]);

  const defaultRedeemerValue = useMemo(() => {
    return deployers?.[0].defaultRedeemerValue;
  }, [deployers]);

  const handleMint = () => {
    mint(JSON.parse(assets), JSON.parse(redeemerVal));
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>{`Mint Params: ${policyParams}`}</div>
      <div>
        {deployers && !!deployers.length ? (
          <MintView
            value={redeemerVal}
            defaultValue={defaultRedeemerValue}
            schema={redeemerSchema}
            assets={assets}
            onRedeemerChange={setRedeemerVal}
            onAssetsChange={setAssets}
            onMint={handleMint}
          />
        ) : null}
      </div>
    </div>
  );
};
