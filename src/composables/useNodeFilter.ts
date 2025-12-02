import { computed } from "vue";
import type { NodeAccess, NodeRole, NodeStatus, Realm } from "@prisma/client";

export interface RealmNode {
  id: string;

  realm: Realm;

  name: string;
  host: string;

  access: NodeAccess;
  status: NodeStatus;

  roles: NodeRole[];

  version: string | null;

  ownerId: string;

  owner: {
    id: string;
    kcId: string;
    name: string;
    alias: string;
    realm: Realm;
    email?: string | null;
    createdAt: string;
    updatedAt: string;
  };

  wireguardId: string | null;
  wireguard: any | null;

  createdAt: string;
  updatedAt: string;
}



export function useNodeFilter(
    node: any,
    search: any,
) {
    const filtered = computed(() => {
        const nodes: RealmNode[] = node.value ?? [];

        return nodes.filter((node) => {
            // name
            const name = (node.name ?? "").toLowerCase();
            const nameMatch = name.includes(search.value.toLowerCase());

            // owner
            const owner = (node.owner.name ?? "").toLowerCase();
            const ownerMatch = owner.includes(search.value.toLowerCase());

            // host
            const host = (node.host ?? "").toLowerCase();
            const hostMatch = host.includes(search.value.toLowerCase());

            // createdAt
            const date = (node.createdAt ?? "")
            const dateMatch = date.includes(search.value.toLowerCase());



            return nameMatch || ownerMatch || hostMatch || dateMatch
        });
    });

    return { filtered };
}
