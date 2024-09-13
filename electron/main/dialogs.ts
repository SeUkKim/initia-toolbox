import { dialog, Notification } from 'electron'

export const messageDialog = async (message: string): Promise<void> => {
  await dialog.showMessageBox({
    message: message,
    title: 'initia-toolbox',
    type: 'info'
  })
}

export const messageNotification = async (message: string): Promise<void> => {
  new Notification({
    title: message,
    silent: true
  }).show()
}

export const contractFinderDialog = async () =>
  dialog.showOpenDialog({
    title: 'initia-toolbox',
    message: 'Add Contract',
    properties: ['openDirectory']
  })
