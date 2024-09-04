import { useValidators } from './useValidators';

import { ValidatorViewer } from '@/src/components/ValidatorViewer';

export const Vesting = () => {
  const { deployers, deploy, unlock, utxos, isLoadingUtxos } = useValidators();

  return (
    <div className="flex flex-1 flex-col gap-4">
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
