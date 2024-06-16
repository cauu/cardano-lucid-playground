import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ArgsEditorPanel } from './ArgsEditorPanel';
// import { IDatumMeta, IRedeemerMeta } from '@/src/common/type';
import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';

interface IProps {
  deployer: ValidatorDeployer;
  // schema: IDatumMeta | IRedeemerMeta;
}

/**
 * 1. There two main panels for args editor, one for lock and one for redeem
 */
export const ValidatorViewer = (props: IProps) => {
  const { deployer } = props;

  const [type, setType] = useState('lock');

  const [datumVal, setDatumVal] = useState('');
  const [redeemerVal, setRedeemerVal] = useState('');

  const datumSchema = useMemo(() => {
    return deployer?.datumMeta;
  }, [deployer]);

  const redeemerSchema = useMemo(() => {
    return deployer?.redeemerMeta;
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

  const handleTypeChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    setType(value);
  };

  const handleDeploy = async () => {};

  return (
    <div className="flex flex-col flex-1 gap-2">
      <FormControl>
        <FormLabel>Gender</FormLabel>

        <RadioGroup row onChange={handleTypeChange} value={type}>
          <FormControlLabel value="lock" control={<Radio />} label="Lock" />
          <FormControlLabel value="unlock" control={<Radio />} label="Unlock" />
        </RadioGroup>
      </FormControl>

      {
        // Datum view
        type === 'lock' ? (
          <div>
            <div className="flex flex-1">
              {<ArgsEditorPanel value={datumVal} schema={datumSchema} onChange={handleDatumChange} />}
            </div>

            <div className="flex justify-end mt-2">
              <Button variant="outlined" onClick={handleDeploy}>
                Deploy
              </Button>
            </div>
          </div>
        ) : null
      }

      {
        // Redeemer view
        type === 'unlock' ? (
          <div>
            <div className="flex flex-1">
              {<ArgsEditorPanel value={redeemerVal} schema={redeemerSchema} onChange={handleRedeemerChange} />}
            </div>

            <div className="flex justify-end mt-2">
              <Button variant="outlined">Unlock</Button>
            </div>
          </div>
        ) : null
      }
    </div>
  );
};
