import { Button } from '@mui/material';
import { useValidators } from './useValidators';

import { ValidatorViewer } from '@/src/components/ValidatorViewer';

export const HelloWorld = () => {
  const { deploy, deployers } = useValidators();

  console.log('deployersdeployers', deployers);

  const handleDeploy = () => {
    deploy();
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>{deployers && deployers.length && <ValidatorViewer deployer={deployers[0]} />}</div>
      <div className="flex justify-end">
        <Button variant="outlined" onClick={handleDeploy}>
          Deploy
        </Button>
      </div>
    </div>
  );
};
