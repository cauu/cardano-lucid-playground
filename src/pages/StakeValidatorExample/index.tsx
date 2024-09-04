import { Alert } from '@mui/material';
import { useValidators } from './useValidators';

import { ValidatorViewer } from '@/src/components/ValidatorViewer';

export const StakeValidatorExample = () => {
  const { deployers, deploy, unlock, utxos, isLoadingUtxos } = useValidators();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <Alert severity="warning">Unlock logic is not implemented yet.</Alert>
      </div>
      <div>
        {deployers && !!deployers.length ? (
          <ValidatorViewer
            isLoadingUtxos={isLoadingUtxos}
            utxos={utxos || []}
            deployer={deployers[0]}
            onDeploy={deploy}
            onUnlock={unlock}
          />
        ) : null}
      </div>
    </div>
  );
};
