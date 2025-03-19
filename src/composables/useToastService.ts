import { useToast } from 'primevue/usetoast'

interface ToastOptions {
  severity?: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail?: string
  life?: number
}

export const useToastService = () => {
  const toast = useToast()

  const show = ({ severity = 'success', detail, summary, life = 3000 }: ToastOptions) => {
    toast.add({ severity, summary, detail, life })
  }

  const success = (summary: string, detail?: string, life = 3000) => {
    show({ severity: 'success', summary, detail, life })
  }

  const error = (summary: string, detail?: string, life = 3000) => {
    show({ severity: 'error', summary, detail, life })
  }

  const info = (summary: string, detail?: string, life = 3000) => {
    show({ severity: 'info', summary, detail, life })
  }

  const warn = (summary: string, detail?: string, life = 3000) => {
    show({ severity: 'warn', summary, detail, life })
  }

  const predefined = {
    user: {
      invited: {
        success: () => success('User invited', 'User has been invited successfully'),
        error: () => error('User invitation failed', 'User could not be invited'),
      },
      deleted: {
        success: () => success('User deleted', 'User has been deleted successfully'),
        error: () => error('User deletion failed', 'User could not be deleted'),
      },
      synced: {
        success: () => success('User synced', 'User has been synced successfully'),
        error: () => error('User sync failed', 'User could not be synced'),
      }
    },
    organisation: {
      created: {
        success: () => success('Organisation created', 'Organisation has been created successfully'),
        error: () => error('Organisation creation failed', 'Organisation could not be created'),
      },
      updated: {
        success: () => success('Organisation updated', 'Organisation has been updated successfully'),
        error: () => error('Organisation update failed', 'Organisation could not be updated'),
      },
      deleted: {
        success: () => success('Organisation deleted', 'Organisation has been deleted successfully'),
        error: () => error('Organisation deletion failed', 'Organisation could not be deleted'),
      },
      synced: {
        success: () => success('Organisation synced', 'Organisation has been synced successfully'),
        error: () => error('Organisation sync failed', 'Organisation could not be synced'),
      }
    },
    partnership: {
      created: {
        success: () => success('Partnership created', 'Partnership has been created successfully'),
        error: () => error('Partnership creation failed', 'Partnership could not be created'),
      },
      updated: {
        success: () => success('Partnership updated', 'Partnership has been updated successfully'),
        error: () => error('Partnership update failed', 'Partnership could not be updated'),
      },
      deleted: {
        success: () => success('Partnership deleted', 'Partnership has been deleted successfully'),
        error: () => error('Partnership deletion failed', 'Partnership could not be deleted'),
      },
    },
    node: {
      created: {
        success: () => success('Node created', 'Node has been created successfully'),
        error: () => error('Node creation failed', 'Node could not be created'),
      },
      deleted: {
        success: () => success('Node deleted', 'Node has been deleted successfully'),
        error: () => error('Node deletion failed', 'Node could not be deleted'),
      },
    },
  }

  return { show, success, error, info, warn, predefined }
}
