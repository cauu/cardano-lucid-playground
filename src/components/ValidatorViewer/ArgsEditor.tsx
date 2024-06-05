import { DataType } from '@/src/common/type';
import Editor from '@monaco-editor/react';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

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

export const ArgsEditor = (props: IProps) => {
  const { schema } = props;

  const groups = schema.anyOf;

  const [tabIndex, setTabIndex] = useState(groups?.[0]?.index || 0);

  const currentFields = groups.find((group) => group.index === tabIndex)?.fields;

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFieldValueChange = (value: any) => {
    console.log(value);
  };

  return (
    <div className="flex-1">
      <Tabs onChange={handleChangeTab} value={tabIndex}>
        {groups?.map((group) => {
          return <Tab label={`${group.title}_${group.index}`} tabIndex={group.index}></Tab>;
        })}
      </Tabs>
      {groups.map((group) => {
        return (
          <div hidden={tabIndex !== group.index}>
            <Editor
              width="45vw"
              height="40vh"
              defaultLanguage="json"
              theme="vs-dark"
              onChange={handleFieldValueChange}
            />
          </div>
        );
      })}
    </div>
  );
};
