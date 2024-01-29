import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

const el = document.getElementById("root");

const root = ReactDOM.createRoot(el!);

const App = () => {
  const [ code, setCode ] = useState('');
  const [ input, setInput ] = useState('');
  const startService = async () => {
    try {
      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.11/esbuild.wasm'
      });
    } catch (err) {

    }
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    try {

      const result = await esbuild.build({
        entryPoints: [ 'index.js' ],
        bundle: true,
        write: false,
        plugins: [
          unpkgPathPlugin(),
          fetchPlugin(input)
        ],
        define: {
          'process.env.NODE_ENV': '"production"',
          global: 'window',
        },
      });
      setCode(result.outputFiles[ 0 ].text);

    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)
        }
      />
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
        }}>
      </textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  );
};


root.render(<App />);
