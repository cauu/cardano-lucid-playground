import { IRedeemerMeta } from '@/src/common/type';
import { ArgsEditorPanel } from './ArgsEditorPanel';
import { Button } from '@mui/material';

interface IProps {
  /** redeemer values */
  value: string;
  defaultValue?: {
    [index: number]: string;
  };
  schema: IRedeemerMeta;
  onRedeemerChange: (val: string) => void;

  /** assets values */
  assets: string;
  onAssetsChange: (val: string) => void;

  onMint: () => void;
}

export const MintView = (props: IProps) => {
  const { value, defaultValue, schema, assets, onRedeemerChange, onAssetsChange, onMint } = props;

  return (
    <div>
      <div className="flex flex-col lg:flex-row flex-1 gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <div>Redeemer</div>
          <div className="flex flex-1">
            <ArgsEditorPanel value={value} defaultValue={defaultValue} schema={schema} onChange={onRedeemerChange} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div>Assets</div>
          <div className="flex flex-1">
            <ArgsEditorPanel value={assets} defaultValue="" onChange={onAssetsChange} />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button variant="outlined" onClick={onMint}>
          Mint
        </Button>
      </div>
    </div>
  );
};
