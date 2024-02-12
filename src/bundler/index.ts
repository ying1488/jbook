import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin';

let service: boolean = false;

const bundle = async (rawCode: string) => {
  if (!service) {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.11/esbuild.wasm'
    });
  }

  try {
    const result = await esbuild.build({
      entryPoints: [ 'index.js' ],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(rawCode)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    return {
      code: result.outputFiles[ 0 ].text,
      err: ''
    }
  }
  catch (err) {
    if (err instanceof Error) {
      return {
        code: '',
        err: err.message,
      };
    } else {
      throw err;
    }
  };
};

export default bundle;
