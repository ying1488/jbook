import * as esbuild from 'esbuild-wasm';
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';
import { fetchPlugin } from './plugins/fetch-plugin';

const el = document.getElementById("root");

const root = ReactDOM.createRoot(el!);

const App = () => {

  const [ input, setInput ] = useState('');
  const [ code, setCode ] = useState('');

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
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}>
      </textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe src="http://nothing.localhost:3000/test.html" />
    </div>
  );
};

root.render(<App />);