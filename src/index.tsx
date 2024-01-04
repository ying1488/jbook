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
        wasmURL: '/esbuild.wasm'
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
          unpkgPathPlugin(input),
          fetchPlugin(input)
        ],
        define: {
          'process.env.NODE_ENV': '"production"',
          global: 'window',
        },
      });

      // console.log(res);

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
    </div>
  );
};

root.render(<App />);