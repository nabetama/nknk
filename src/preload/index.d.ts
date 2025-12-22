import { ElectronAPI } from '@electron-toolkit/preload'

export type SourceInfo = {
  id: string
  name: string
  thumbnail: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSources: () => Promise<SourceInfo[]>
    }
  }
}
