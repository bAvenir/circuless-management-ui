export const MasterAuthApi = {
  async checkAccess() {
    return await $fetch(`/api/master/auth/checkAccess`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
