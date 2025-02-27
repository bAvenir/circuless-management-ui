import type { Realm } from "@prisma/client"

export const UserApi = {
  async getMy(realm: Realm) {
    return await useFetch(`/api/${realm}/user/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },
}
