import { DataType } from '@/src/common/type';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { Editor } from './Editor';

const DEFAULT_VALUE_MAPPING: any = {
  bytes: '',
  integer: 0
};

interface IProps {
  schema: {
    title: string;
    anyOf: {
      title: string;
      dataType: 'constructor';
      index: number;
      fields: { dataType: DataType; title: string }[];
    }[];
  };
}

export const ArgsEditorPanel = (props: IProps) => {
  const { schema } = props;

  const groups = schema.anyOf;

  const [tabIndex, setTabIndex] = useState(groups?.[0]?.index || 0);

  // const currentFields = groups.find((group) => group.index === tabIndex)?.fields;

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Tabs onChange={handleChangeTab} value={tabIndex}>
        {groups?.map((group) => {
          return <Tab label={`${group.title}_${group.index}`} tabIndex={group.index}></Tab>;
        })}
      </Tabs>
      {(groups || []).map((group) => {
        const defaultValue = group.fields.reduce((acc: any, field: any) => {
          acc[field.title] = `${DEFAULT_VALUE_MAPPING[field.dataType]}`;
          return acc;
        }, {});

        return (
          <div className="relative flex-1 min-h-[40vh]" hidden={group.index !== tabIndex}>
            <Editor defaultValue={JSON.stringify(defaultValue)} />
          </div>
        );
      })}
    </div>
  );
};
