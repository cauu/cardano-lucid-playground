import { DataType } from '@/src/common/type';
import { Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { Editor } from './Editor';

interface IProps {
  value: string;
  defaultValue: any;
  schema?: {
    title: string;
    anyOf: {
      title: string;
      dataType: 'constructor';
      index: number;
      fields: { dataType: DataType; title: string }[];
    }[];
  };
  onChange: (value: string) => void;
}

export const ArgsEditorPanel = (props: IProps) => {
  const { value, defaultValue, schema, onChange } = props;

  const groups = useMemo(() => {
    return schema?.anyOf;
  }, [schema]);

  const [tabIndex, setTabIndex] = useState(groups?.[0]?.index || 0);

  const currDefaultValue = useMemo(() => {
    return JSON.stringify(defaultValue[tabIndex]);
  }, [defaultValue, tabIndex]);

  useEffect(() => {
    onChange?.(currDefaultValue);
  }, [currDefaultValue, onChange]);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleValueChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <div className="flex-1 flex flex-col">
      {groups && groups.length && (
        <Tabs onChange={handleChangeTab} value={tabIndex}>
          {groups?.map((group) => {
            return <Tab label={`${group.title}_${group.index}`} tabIndex={group.index}></Tab>;
          })}
        </Tabs>
      )}
      <div className="relative flex-1 min-h-[40vh]">
        <Editor value={value} defaultValue={currDefaultValue} onChange={handleValueChange} />
      </div>
    </div>
  );
};
