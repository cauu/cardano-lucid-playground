import { Button } from '@mui/material';

import { IDatumMeta } from '@/src/common/type';
import { ArgsEditorPanel } from './ArgsEditorPanel';

interface IProps {
  value: string;
  defaultValue?: {
    [index: number]: string;
  };
  schema: IDatumMeta;
  onChange: (val: string) => void;
  onDeploy: () => void;
}

export const DatumView = (props: IProps) => {
  const { value, defaultValue, schema, onChange, onDeploy } = props;

  return (
    <div>
      <div className="flex flex-1">
        {<ArgsEditorPanel value={value} defaultValue={defaultValue} schema={schema} onChange={onChange} />}
      </div>

      <div className="flex justify-end mt-2">
        <Button variant="outlined" onClick={onDeploy}>
          Deploy
        </Button>
      </div>
    </div>
  );
};
