import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const el = document.getElementById("root");

const root = ReactDOM.createRoot(el!);

const App = () => {

  const iframe = useRef<any>();
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
      // setCode(result.outputFiles[ 0 ].text);
      iframe.current.contentWindow.postMessage(result.outputFiles[ 0 ].text, '*');
    } catch (err) {
      console.error(err);
    }
  };

  const html = `
  <html>
    <head></head>
    <body>
     <div id="root"></div>
       <script>
       window,addEventListener('message',(event)=>{
       eval(event.data);
       },false);
       </script>
    </body>
  </html>
  `;

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
      <iframe ref={iframe} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};


root.render(<App />);
