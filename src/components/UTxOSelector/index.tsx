import { Popover } from '@mui/material';
import { IUTxO } from '@/src/common/type';
import { useState } from 'react';

interface IProps {
  utxo: IUTxO;
}

export const UTxOSelector = (props: IProps) => {
  const { utxo } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);

  console.log('utxo', !!utxo.datum);

  const txUrl = `https://cardanoscan.io/transaction/${utxo.txHash}`;
  const addressUrl = `https://cardanoscan.io/address/${utxo.address}`;

  const handleShowDatum = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDatum = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex justify-between border p-4">
      <div className="flex items-center gap-2">
        <div>Radio</div>
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
        {utxo.datum ? <button onClick={handleShowDatum}>Datum</button> : null}
        <Popover open={open} onClose={handleCloseDatum} anchorEl={anchorEl}>
          <div className="p-4 w-80 text-wrap break-words">{JSON.stringify(utxo.datumDecoded)}</div>
        </Popover>
        {/* ) : null} */}
      </div>
    </div>
  );
};
