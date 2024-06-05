import { ValidatorDeployer } from '@/src/contract/ValidatorDeployer';
import { ArgsEditor } from './ArgsEditor';

interface IProps {
  deployer: ValidatorDeployer;
}

export const ValidatorViewer = (props: IProps) => {
  const { deployer } = props;

  const datumMeta = deployer?.datumMeta;

  const redeemerMeta = deployer?.redeemerMeta;

  return (
    <div className="flex flex-1 gap-2">
      <div className="flex flex-1">
        <ArgsEditor schema={datumMeta} />
      </div>

      <div className="flex flex-1">
        <ArgsEditor schema={redeemerMeta} />
      </div>
    </div>
  );
};
