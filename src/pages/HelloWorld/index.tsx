import { Button } from '@mui/material';
import { useValidators } from './useValidators';

export const HelloWorld = () => {
  const { deploy } = useValidators();

  return (
    <div>
      <Button onClick={deploy}>Deploy</Button>
    </div>
  );
};
