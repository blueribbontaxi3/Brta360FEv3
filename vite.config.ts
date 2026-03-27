import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                exportType: 'default',
            },
        }),
        viteTsconfigPaths(), // Automatically resolves path aliases from tsconfig.json
    ],
    server: {
        host: true,
        port: 3000,
        open: true,
    },
        build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
            manualChunks: {
                'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                'redux-vendor': ['redux', 'react-redux', '@reduxjs/toolkit'],
                'antd-vendor': ['antd', '@ant-design/charts', '@ant-design/plots'],
                'utils-vendor': ['moment', 'lodash', 'axios'],
                'pdf-vendor': ['react-pdf', 'pdfjs-dist'],
            },
            },
        },
        chunkSizeWarningLimit: 1000,
        },
    optimizeDeps: {
        include: ['react', 'react-dom', 'antd'],
    },
});
