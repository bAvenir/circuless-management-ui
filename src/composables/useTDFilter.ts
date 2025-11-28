import { computed } from "vue";

export function useTDFilter(
    thingDescriptions: any,
    search: any,
    selectedType: any
) {
    const filtered = computed(() => {
        const tds: any[] = thingDescriptions.value ?? [];

        return tds.filter((td) => {
            const title = (td.td.title ?? "").toLowerCase();
            const matchesSearch = title.includes(search.value.toLowerCase());

            const type = td.td.properties?.status?.type;
            const matchesType =
                selectedType.value === "all" || type === selectedType.value;

            return matchesSearch && matchesType;
        });
    });

    return { filtered };
}
