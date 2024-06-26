import { readFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser'

const pkg = JSON.parse(readFileSync('./package.json') as unknown as string);

const input = 'src/index.tsx';

const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'named'} as const;
const esmOutput = { file: pkg.module, format: 'es', exports: 'named' } as const;
const dtsOutput = { file: pkg.types, format: 'es', exports: 'named' } as const;

const plugins = [typescript(), terser()];

const external = [
  ...Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }),
  /^react($|\/)/,
];

const config: RollupOptions[] = [
  { input, output: cjsOutput, plugins, external },
  { input, output: esmOutput, plugins, external },
  { input, output: dtsOutput, plugins: [dts()] },
];

export default config;
