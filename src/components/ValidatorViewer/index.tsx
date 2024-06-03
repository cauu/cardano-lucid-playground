import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';

interface IProps {
  title: string;
  key: 'anyOf';
  groups: {
    title: string;
    index: number;
    fields: { dataType: string; title: string }[];
  }[];
}

export const ValidatorViewer = (props: IProps) => {
  const { title, groups } = props;

  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <h3>{title}</h3>

      <Tabs onChange={handleChangeTab} value={tabIndex}>
        {groups?.map((group) => {
          return <Tab label={`${group.title}_${group.index}`} tabIndex={group.index}></Tab>;
        })}
        <Tab label="datum"></Tab>
      </Tabs>
    </div>
  );
};
