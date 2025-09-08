import {useMemo, useState} from 'react';
import TopBar from './TopBar';
import StatsPanel from './StatsPanel';
import Graph from "./Graph/Graph.tsx";
import {useTBoxesQuery} from "../../hooks/useTBoxesQuery.ts";
import {useRepoStore} from "../../store/repo.store.ts";
import {useGraphTBoxQuery} from "../../hooks/useGraphTBoxQuery.ts";
import {useTBoxesStore} from "../../store/tBoxes.store.ts";

export default function Dashboard() {
  const {selectedRepositoryId} = useRepoStore();
  const {selectedTBoxId} = useTBoxesStore();
  const {data: tboxes} = useTBoxesQuery(selectedRepositoryId);
  const {data: graphData} = useGraphTBoxQuery(selectedRepositoryId, selectedTBoxId);
  const [isEditMode] = useState(false);

  const selectedTBox = useMemo(() => {
    return tboxes?.find(t => t.tboxKey === selectedTBoxId)
  }, [selectedTBoxId, tboxes]);


  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <TopBar isEditMode={isEditMode} selectedTBox={selectedTBox}/>

      <StatsPanel graphData={graphData} />

      <div className="flex-1 flex min-h-px">
        <div className="flex-1">
          {graphData && <Graph graphData={graphData}/>}
        </div>
      </div>
    </div>
  );
}