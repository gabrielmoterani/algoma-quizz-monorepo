/* eslint-disable @typescript-eslint/ban-ts-comment */
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  main: {
    // @ts-ignore
    plugins: [externalizeDepsPlugin(), tailwindcss()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src'),
        '$/orm': resolve('../../packages/orm')
      }
    },
    plugins: [react()]
  }
})
