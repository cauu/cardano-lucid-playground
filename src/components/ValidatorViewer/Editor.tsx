import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { useRef } from 'react';

export const Editor = () => {
  const monacoRef = useRef<Monaco>();

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = monaco;
  }

  const handleFieldValueChange = (value: any) => {
    console.log(value);
  };

  return (
    <MonacoEditor
      width="45vw"
      height="40vh"
      defaultLanguage="json"
      theme="vs-dark"
      onChange={handleFieldValueChange}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
    />
  );
};
