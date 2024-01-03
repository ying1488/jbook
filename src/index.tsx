import * as esbuild from 'esbuild-wasm';
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';

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
      const res = await esbuild.build({
        entryPoints: [ 'index.js' ],
        bundle: true,
        write: false,
        plugins: [ unpkgPathPlugin() ]
      });

      // console.log(res);

      setCode(res.outputFiles[ 0 ].text);
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