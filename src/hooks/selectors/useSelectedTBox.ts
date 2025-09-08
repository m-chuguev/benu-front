import { useMemo } from "react";
import {useTBoxesQuery} from "../useTBoxesQuery.ts";
import {useTBoxesStore} from "../../store/tBoxes.store.ts";

export function useSelectedTBox(repoId: string | null) {
    const { data: tboxes = [], isLoading, isError, error, isFetched } = useTBoxesQuery(repoId);
    const [selectedTBoxId, setSelectedTBoxId] = useTBoxesStore((s) => [s.selectedTBoxId, s.setSelectedTBoxId]);

    const selectedTBox = useMemo(
        () => tboxes.find((t) => t.tboxKey === selectedTBoxId) ?? null,
        [tboxes, selectedTBoxId]
    );

    return {
        tboxes,
        selectedTBoxId,
        setSelectedTBoxId,
        selectedTBox,
        isLoading,
        isError,
        error,
        isFetched,
    };
}
