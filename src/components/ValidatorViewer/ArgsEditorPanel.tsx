import { DataType } from '@/src/common/type';
import { Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { Editor } from './Editor';

const DEFAULT_VALUE_MAPPING: any = {
  bytes: '',
  integer: 0
};

interface IProps {
  value: string;
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
  const { value, schema, onChange } = props;

  const groups = useMemo(() => {
    return schema?.anyOf;
  }, [schema]);

  const [tabIndex, setTabIndex] = useState(groups?.[0]?.index || 0);

  const defaultValue = useMemo(() => {
    const nextIndex = tabIndex;
    const group = groups?.find((group) => group.index === nextIndex);

    const _values = group?.fields.reduce((acc: any, field: any) => {
      acc[field.title] = `${DEFAULT_VALUE_MAPPING[field.dataType]}`;
      return acc;
    }, {});

    return JSON.stringify(_values);
  }, [tabIndex, groups]);

  useEffect(() => {
    onChange?.(defaultValue);
  }, [defaultValue, onChange]);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleValueChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Tabs onChange={handleChangeTab} value={tabIndex}>
        {groups?.map((group) => {
          return <Tab label={`${group.title}_${group.index}`} tabIndex={group.index}></Tab>;
        })}
      </Tabs>
      <div className="relative flex-1 min-h-[40vh]">
        <Editor value={value} defaultValue={defaultValue} onChange={handleValueChange} />
      </div>
      {/* {(groups || []).map((group) => {
        const defaultValue = group.fields.reduce((acc: any, field: any) => {
          acc[field.title] = `${DEFAULT_VALUE_MAPPING[field.dataType]}`;
          return acc;
        }, {});

        return (
          <div className="relative flex-1 min-h-[40vh]" hidden={group.index !== tabIndex}>
            <Editor value={value} defaultValue={JSON.stringify(defaultValue)} onChange={handleValueChange} />
          </div>
        );
      })} */}
    </div>
  );
};
