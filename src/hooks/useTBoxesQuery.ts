import { useQuery } from "@tanstack/react-query";
import {GraphDbRepositoriesService} from "../api";

export function useTBoxesQuery(repoId: string | null) {
    return useQuery({
        queryKey: ["tboxes", repoId],
        enabled: !!repoId,
        queryFn: () => {
            return GraphDbRepositoriesService.listTboxes(repoId!)
        },
        placeholderData: []
    });
}