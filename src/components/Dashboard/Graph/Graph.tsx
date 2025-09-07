/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type {GraphDto} from "../../../api";
import {mapOntology, NodeDatum, SimpleGraph} from "./util";
import {addGridBackground, addGridDefs} from "./grid-bg.ts";
import {SimulationLinkDatum} from "d3";
import {installZoom} from "./zoom.ts";
import {ensureMarker} from "./markers.ts";
import {drawNodes} from "./nodes.ts";
import {drawLinks} from "./links.ts";
import {buildEdgeKindColorMap, buildTypeColorMap, colorForLinkFactory, colorForNodeFactory} from "./colors.ts";

interface GraphProps {
  graphData: GraphDto
}

export default function Graph({graphData}: GraphProps) {
  const [data, setData] = useState<SimpleGraph | null>(null);
  const [, setSelectNodeId] = useState<string | null>(null);

  useEffect(() => {
    setData(mapOntology(graphData))
  }, [graphData]);

  const svgRoot = useRef<SVGSVGElement | null>(null);
  const typeMap = useMemo(
      () => buildTypeColorMap(data?.nodes ?? [], (data as any)?.types),
      [data]
  );
  const colorForNode = useMemo(() => colorForNodeFactory(typeMap), [typeMap]);

  const edgeKindMap = useMemo(
      () => buildEdgeKindColorMap(data?.links ?? []),
      [data]
  );
  const colorForLink = useMemo(() => colorForLinkFactory(edgeKindMap), [edgeKindMap]);

  useEffect((): any  => {
    if (!svgRoot.current || !data) return;

    const svg = d3.select(svgRoot.current);
    svg.selectAll("* > :not(defs)").remove(); // очистка перед отсисовкой
    const rootG = svg.append("g");
    const defs = svg.append("defs");
// ============

    addGridDefs(svg);
    addGridBackground(rootG);
// ============

    installZoom(svg, rootG)
// ============

    // маркеры (стрелки по направлениям)
    Object.entries(edgeKindMap).forEach(([k, color]) => ensureMarker(defs, `arrow-${k}`, color));
// ============

    const sim = d3
      .forceSimulation<NodeDatum>(data.nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, SimulationLinkDatum<any>>(data.links as any)
          .id(d => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide().radius(18));

    const {position: posNodes} = drawNodes(rootG, data.nodes, colorForNode, setSelectNodeId, sim)
    const {position: posLinks } = drawLinks(rootG, data.links, colorForLink);

    sim.on("tick", () => { posLinks(); posNodes(); });

    return () => sim.stop();
  }, [data]);

  return (
      <svg
          ref={svgRoot}
          height="100%"
          width="100%"
          viewBox="-400 -300 800 600"
          preserveAspectRatio="xMidYMid meet"
      />
  );
}
