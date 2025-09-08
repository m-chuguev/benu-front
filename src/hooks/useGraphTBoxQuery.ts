import { useQuery } from "@tanstack/react-query";
import { OntologyGraphViewService} from "../api";

export function useGraphTBoxQuery(repoId: string | null, tBoxId: string | null) {
    return useQuery({
        queryKey: ["graph", repoId, tBoxId],
        enabled: !!repoId && !!tBoxId,
        queryFn: () => OntologyGraphViewService.getGraphViewMap(repoId!, tBoxId!),
        placeholderData: {
            nodes: [],
            edges: []
        }
    });
}