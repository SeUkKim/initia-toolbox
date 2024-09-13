import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from '@svgr/rollup'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts'),
          initia: resolve(__dirname, 'electron/main/initia.ts'),
          ipcServer: resolve(__dirname, 'electron/main/IPCServer.ts'),
          dialogs: resolve(__dirname, 'electron/main/dialogs.ts')
        },
        external: ['@initia/builder.js']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
    },
    plugins: [react(), nodePolyfills(), svgr()]
  }
})
