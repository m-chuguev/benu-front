import { useQuery } from "@tanstack/react-query";
import {GraphDbRepositoriesService, RepositorySummaryDto} from "../api"; // твой сгенерированный сервис

export function useRepositoriesQuery() {
    return useQuery({
        queryKey: ["repositories"],
        queryFn: (): Promise<RepositorySummaryDto[]> => GraphDbRepositoriesService.listRepositories(),
        placeholderData: []
    });
}
