import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import dts from "vite-plugin-dts";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [svgr(), dts(), react()],
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, './src/shared'),
            '@ui-kit': path.resolve(__dirname, './src/ui-kit'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
})
