import type { userTypes } from '~/shared/types'

export const CirculessUserApi = {
  async invite(data: userTypes.InviteBody) {
    return await $fetch(`/api/circuless/user/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },
}
