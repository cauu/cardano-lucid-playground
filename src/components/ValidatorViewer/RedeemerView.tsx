import { Button } from '@mui/material';
import { UTxO } from 'lucid-cardano';

import { IRedeemerMeta } from '@/src/common/type';
import { UTxOSelector } from '@/src/components/UTxOSelector';
import { ArgsEditorPanel } from './ArgsEditorPanel';

interface IProps {
  utxos: UTxO[];
  value: string;
  defaultValue?: {
    [index: number]: string;
  };
  schema: IRedeemerMeta;
  onChange: (val: string) => void;
  onUnlock: () => void;
}

export const RedeemerView = (props: IProps) => {
  const { value, utxos, defaultValue, schema, onChange, onUnlock } = props;

  return (
    <div>
      <div className="flex flex-1">
        {<ArgsEditorPanel value={value} defaultValue={defaultValue} schema={schema} onChange={onChange} />}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xl font-[600]">UTxOs</div>
        {utxos?.map((utxo) => {
          return <UTxOSelector key={utxo.txHash} utxo={utxo} />;
        })}
      </div>

      <div className="flex justify-end mt-2">
        <Button variant="outlined" onClick={onUnlock}>
          Unlock
        </Button>
      </div>
    </div>
  );
};
