import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { IUTxO } from '@/src/common/type';
import { DatumView } from './DatumView';
import { RedeemerView } from './RedeemerView';
import { MintView } from './MintView';
// import { IDatumMeta, IRedeemerMeta } from '@/src/common/type';

interface IProps {
  deployer: ValidatorDeployer;
  isLoadingUtxos: boolean;
  utxos: IUTxO[];
  onDeploy?: (val: any) => void;
  onUnlock?: (utxos: IUTxO[], redeemer: any) => void;
  // schema: IDatumMeta | IRedeemerMeta;
}

export { DatumView, RedeemerView, MintView };

/**
 * 1. There two main panels for args editor, one for lock and one for redeem
 */
export const ValidatorViewer = (props: IProps) => {
  const { deployer, utxos, isLoadingUtxos, onDeploy, onUnlock } = props;

  const [operation, setOperation] = useState('lock');

  const [datumVal, setDatumVal] = useState('');
  const [redeemerVal, setRedeemerVal] = useState('');

  const datumSchema = useMemo(() => {
    return deployer?.datumMeta;
  }, [deployer]);

  const redeemerSchema = useMemo(() => {
    return deployer?.redeemerMeta;
  }, [deployer]);

  const defaultRedeemerValue = useMemo(() => {
    return deployer?.defaultRedeemerValue;
  }, [deployer]);

  const defaultDatumValue = useMemo(() => {
    return deployer?.defaultDatumValue;
  }, [deployer]);

  const handleDatumChange = useCallback(
    (val: string) => {
      setDatumVal(val);
    },
    [setDatumVal]
  );

  const handleRedeemerChange = useCallback(
    (val: string) => {
      setRedeemerVal(val);
    },
    [setRedeemerVal]
  );

  const handleOperationChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    setOperation(value);
  };

  const handleDeploy = async () => {
    onDeploy?.(JSON.parse(datumVal));
  };

  const handleUnlock = async (utxos: IUTxO[], redeemerVal: any) => {
    onUnlock?.(utxos, redeemerVal);
  };

  return (
    <div className="flex flex-col flex-1 gap-2">
      <FormControl className="!flex !flex-row !items-center gap-4">
        <FormLabel>Type</FormLabel>

        <RadioGroup row onChange={handleOperationChange} value={operation}>
          <FormControlLabel value="lock" control={<Radio />} label="Lock" />
          <FormControlLabel value="unlock" control={<Radio />} label="Unlock" />
        </RadioGroup>
      </FormControl>

      {
        // Datum view
        operation === 'lock' ? (
          <DatumView
            value={datumVal}
            defaultValue={defaultDatumValue}
            schema={datumSchema}
            onChange={handleDatumChange}
            onDeploy={handleDeploy}
          />
        ) : null
      }

      {
        // Redeemer view
        operation === 'unlock' ? (
          <RedeemerView
            utxos={utxos}
            isLoadingUtxos={isLoadingUtxos}
            value={redeemerVal}
            defaultValue={defaultRedeemerValue}
            schema={redeemerSchema}
            onChange={handleRedeemerChange}
            onUnlock={handleUnlock}
          />
        ) : null
      }
    </div>
  );
};
