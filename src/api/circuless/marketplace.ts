export const CirculessMarketplaceApi = {
    async getAll() {
        return await $fetch(`/api/circuless/marketplace`, {
            method: "GET",
        });
    },

    async get(id: string) {
        if (!isValidId(id)) throw new Error("Invalid id");
        return await $fetch(`/api/circuless/marketplace/${id}`, {
            method: "GET",
        });
    },
};
