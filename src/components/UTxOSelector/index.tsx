import classNames from 'classnames';
import { Popover, Checkbox } from '@mui/material';
import { IUTxO } from '@/src/common/type';
import { useState } from 'react';
import { useLucid } from '@/src/hooks/useLucid';
import { NetworkType } from '@cardano-foundation/cardano-connect-with-wallet-core';

interface IProps {
  utxo: IUTxO;
  onSelect?: (utxo: IUTxO) => void;
  onUnselect?: (utxo: IUTxO) => void;
}

export const UTxOSelector = (props: IProps) => {
  const { utxo, onSelect, onUnselect } = props;

  const { networkType } = useLucid();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const open = Boolean(anchorEl);

  const txUrl =
    networkType === NetworkType.MAINNET
      ? `https://cardanoscan.io/transaction/${utxo.txHash}`
      : `https://preview.cardanoscan.io/transaction/${utxo.txHash}`;
  const addressUrl =
    networkType === NetworkType.MAINNET
      ? `https://cardanoscan.io/address/${utxo.address}`
      : `https://preview.cardanoscan.io/address/${utxo.address}`;

  const handleShowDatum = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDatum = () => {
    setAnchorEl(null);
  };

  const handleChecked = (_: any, checked: boolean) => {
    setIsSelected(checked);
    if (checked) {
      onSelect?.(utxo);
    } else {
      onUnselect?.(utxo);
    }
  };

  return (
    <div
      className={classNames('flex justify-between border p-4', {
        ['border-blue-500']: isSelected
      })}
    >
      <div className="flex items-center gap-2">
        <div>
          <Checkbox checked={isSelected} onChange={handleChecked} />
        </div>
        <div>
          <div className="text-sm mb-2">
            <div>Transaction</div>
            <a href={txUrl} target="__blank" className="text-blue-700 hover:underline">
              {utxo.txHash}
            </a>
          </div>
          <div className="text-sm">
            <div>Address</div>
            <a href={addressUrl} target="__blank" className="text-blue-700 hover:underline">
              {utxo.address}
            </a>
          </div>
        </div>
      </div>

      <div className="text-sm flex flex-col justify-between items-end">
        <div>
          {Object.keys(utxo.assets).map((asset) => {
            return (
              <div key={asset}>
                {asset}: {utxo.assets[asset].toString()}
              </div>
            );
          })}
        </div>
        {utxo.datum ? (
          <button className="text-blue-700" onClick={handleShowDatum}>
            Datum
          </button>
        ) : null}
        {utxo.scriptRef ? <button className="text-blue-700">Has Script</button> : null}
        <Popover open={open} onClose={handleCloseDatum} anchorEl={anchorEl}>
          <div className="p-4 w-80 text-wrap break-words">{JSON.stringify(utxo.datumDecoded)}</div>
        </Popover>
        {/* ) : null} */}
      </div>
    </div>
  );
};
