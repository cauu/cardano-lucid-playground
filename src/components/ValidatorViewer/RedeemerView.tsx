import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import { IRedeemerMeta, IUTxO } from '@/src/common/type';
import { UTxOSelector } from '@/src/components/UTxOSelector';
import { ArgsEditorPanel } from './ArgsEditorPanel';

interface IProps {
  utxos: IUTxO[];
  isLoadingUtxos: boolean;
  value: string;
  defaultValue?: {
    [index: number]: string;
  };
  schema: IRedeemerMeta;
  onChange: (val: string) => void;
  onUnlock: (utxos: IUTxO[], redeemer: any) => void;
}

export const RedeemerView = (props: IProps) => {
  const { value, utxos, isLoadingUtxos, defaultValue, schema, onChange, onUnlock } = props;

  const [selectedUtxos, setSelectedUtxos] = useState<IUTxO[]>([]);

  const handleSelect = (utxo: IUTxO) => {
    setSelectedUtxos((prevs) => {
      if (selectedUtxos.find((prev) => prev.txHash + prev.outputIndex === utxo.txHash + utxo.outputIndex)) {
        return prevs;
      }

      return [...prevs, utxo];
    });
  };

  const handleUnselect = (utxo: IUTxO) => {
    setSelectedUtxos((prevs) => {
      const index = selectedUtxos.findIndex(
        (prev) => prev.txHash + prev.outputIndex === utxo.txHash + utxo.outputIndex
      );

      if (index >= 0) {
        return prevs.slice(0, index).concat(prevs.slice(index + 1));
      }

      return prevs;
    });
  };

  const handleUnlock = () => {
    onUnlock?.(selectedUtxos, JSON.parse(value));
  };

  return (
    <div>
      <div className="flex flex-1">
        {<ArgsEditorPanel value={value} defaultValue={defaultValue} schema={schema} onChange={onChange} />}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xl font-[600]">UTxOs</div>
        {isLoadingUtxos && (
          <div>
            <CircularProgress />
          </div>
        )}
        {utxos?.map((utxo) => {
          return <UTxOSelector key={utxo.txHash} utxo={utxo} onSelect={handleSelect} onUnselect={handleUnselect} />;
        })}
      </div>

      <div className="flex justify-end mt-2">
        <Button variant="outlined" onClick={handleUnlock}>
          Unlock
        </Button>
      </div>
    </div>
  );
};
