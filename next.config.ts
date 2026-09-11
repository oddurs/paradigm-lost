import path from 'node:path';
import type { NextConfig } from 'next';
import withStylexTurbopack from '@stylexswc/nextjs-plugin/turbopack';

const root = process.cwd();

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  images: { unoptimized: true },
};

export default withStylexTurbopack({
  rsOptions: {
    dev: process.env.NODE_ENV === 'development',
    treeshakeCompensation: true,
    aliases: { '@/*': [path.join(root, '*')] },
    unstable_moduleResolution: { type: 'commonJS', rootDir: root },
  },
})(nextConfig);
