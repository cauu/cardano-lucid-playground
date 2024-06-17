import { useValidators } from './useValidators';

import { ValidatorViewer } from '@/src/components/ValidatorViewer';

export const HelloWorld = () => {
  const { deployers, deploy } = useValidators();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        {deployers && !!deployers.length ? <ValidatorViewer deployer={deployers[0]} onDeploy={deploy} /> : null}
      </div>
    </div>
  );
};
