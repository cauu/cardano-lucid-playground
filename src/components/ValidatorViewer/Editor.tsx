import MonacoEditor, { Monaco } from '@monaco-editor/react';
// import MonacoEditor from 'react-monaco-editor'
import { useRef } from 'react';

interface IProps {
  value: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const Editor = (props: IProps) => {
  const { value, defaultValue, onChange } = props;
  // const [value, setValue] = useState(defaultValue);
  const monacoRef = useRef<Monaco>();
  const editorRef = useRef<any>();

  function handleEditorWillMount() {}

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = monaco;
    editorRef.current = editor;

    setTimeout(() => {
      editor.getAction('editor.action.formatDocument').run();
    }, 1000);
  }

  const handleFieldValueChange = (value: any) => {
    onChange?.(value);
  };

  return (
    <MonacoEditor
      className="absolute w-full h-full"
      options={{
        automaticLayout: true
      }}
      defaultLanguage="json"
      theme="vs-dark"
      defaultValue={defaultValue}
      value={value}
      onChange={handleFieldValueChange}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
    />
  );
};
