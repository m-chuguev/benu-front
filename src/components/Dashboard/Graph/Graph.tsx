/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

/**
 * React + D3 Directed Graph
 *
 * Поддерживаемые форматы входного JSON:
 *
 * 1) "Простой":
 * {
 *   nodes: [{ id, label, type }],
 *   links: [{ source, target, label }],
 *   types?: { [type]: { label, color } }
 * }
 *
 * 2) "Онтология" (как в вашем примере):
 * {
 *   meta?: {...},
 *   nodes: [{ id, label, kind: "CLASS" | "INDIVIDUAL", ... }],
 *   edges: [{ from, to, label, kind: "SUBCLASS_OF"|"RDF_TYPE"|"OBJECT_PROPERTY", directed: true }],
 *   page?: {...}
 * }
 *   — Узлы будут окрашены по kind (CLASS/INDIVIDUAL),
 *   — Рёбра могут быть стилизованы по kind (см. легенду рёбер).
 */

// ===== Пример из задания (вырезка 1:1) =====
const sampleOntology = {"meta":{"title":"Example Services Ontology (subset, mock)","query":"repository=df; tBox=df","namespace":"","prefixes":{"":"https://example.com/ontology#"}},"nodes":[{"id":"d31022f6-0c21-3a67-915c-7a9b38b9fb25","iri":"https://example.com/ontology#Service","qname":":Service","label":"Service","comment":null,"kind":"CLASS"},{"id":"9c568652-e36e-3b31-88bc-6401265b0a44","iri":"https://example.com/ontology#Procedure","qname":":Procedure","label":"Procedure","comment":null,"kind":"CLASS"},{"id":"228e6cfd-82f1-3b2c-9a6d-508c0fab92c3","iri":"https://example.com/ontology#Document","qname":":Document","label":"Document","comment":null,"kind":"CLASS"},{"id":"2b9d0c00-3a75-3cc1-95ee-db70e18e56e3","iri":"https://example.com/ontology#Location","qname":":Location","label":"Location","comment":null,"kind":"CLASS"},{"id":"033ad5af-4c6d-3f8a-9a5c-301621033a29","iri":"https://example.com/ontology#MedicalCondition","qname":":MedicalCondition","label":"Medical Condition","comment":null,"kind":"CLASS"},{"id":"3bfcc8a0-a1a2-3c14-bd7b-9c3714b53da4","iri":"https://example.com/ontology#Policy","qname":":Policy","label":"Policy","comment":null,"kind":"CLASS"},{"id":"ebf10a09-277d-3e00-bbe7-fc8eb7aeba13","iri":"https://example.com/ontology#Person","qname":":Person","label":"Person","comment":null,"kind":"CLASS"},{"id":"bbf32d37-2a05-37c6-90ce-36c793c70787","iri":"https://example.com/ontology#Specialist","qname":":Specialist","label":"Specialist","comment":null,"kind":"CLASS"},{"id":"d2548003-75d5-32a8-8395-27b93985ac47","iri":"https://example.com/ontology#ClassicFacial","qname":":ClassicFacial","label":"Classic Facial Care","comment":null,"kind":"INDIVIDUAL","data":[{"iri":"https://example.com/ontology#hasDuration","qname":":hasDuration","label":"has duration","datatype":"xsd:string","values":["60 minutes"],"truncated":false}]},{"id":"e7bccdc9-d0f7-3000-b733-daa25b9086d8","iri":"https://example.com/ontology#ChemicalPeeling","qname":":ChemicalPeeling","label":"Chemical Peeling","comment":null,"kind":"INDIVIDUAL","data":[{"iri":"https://example.com/ontology#hasDescription","qname":":hasDescription","label":"has description","datatype":"xsd:string","values":["Professional chemical peel for skin renewal."],"truncated":false}]},{"id":"865f1956-652e-3992-9218-b7ae2fbec920","iri":"https://example.com/ontology#branch_east","qname":":branch_east","label":"East Branch","comment":null,"kind":"INDIVIDUAL","data":[{"iri":"https://example.com/ontology#hasWorkingHours","qname":":hasWorkingHours","label":"has working hours","datatype":"xsd:string","values":["Weekdays 9:00-21:00, Weekends 10:00-19:00"],"truncated":false}]},{"id":"c0c5535e-210d-3b6b-8ced-feacb2497580","iri":"https://example.com/ontology#doc_peeling_consent","qname":":doc_peeling_consent","label":"Informed Consent for Peeling","comment":null,"kind":"INDIVIDUAL"},{"id":"754e1142-c221-3bf8-a418-bd82133591b8","iri":"https://example.com/ontology#policy_standard_cancellation","qname":":policy_standard_cancellation","label":"Standard Cancellation Policy","comment":null,"kind":"INDIVIDUAL"},{"id":"344d5d81-80c7-3aef-8067-36924d7be0f6","iri":"https://example.com/ontology#cond_pregnancy","qname":":cond_pregnancy","label":"Pregnancy","comment":null,"kind":"INDIVIDUAL"}],"edges":[{"id":"6ec85790-c763-3077-a2df-2c4e7bec0165","from":"9c568652-e36e-3b31-88bc-6401265b0a44","to":"d31022f6-0c21-3a67-915c-7a9b38b9fb25","kind":"SUBCLASS_OF","iri":null,"qname":null,"label":"subClassOf","directed":true},{"id":"0c414c8b-bf9b-39e3-b77b-77b0ef3d0f69","from":"bbf32d37-2a05-37c6-90ce-36c793c70787","to":"ebf10a09-277d-3e00-bbe7-fc8eb7aeba13","kind":"SUBCLASS_OF","iri":null,"qname":null,"label":"subClassOf","directed":true},{"id":"47ed9a2a-793f-39b3-bab5-608dd0cbbd09","from":"d2548003-75d5-32a8-8395-27b93985ac47","to":"9c568652-e36e-3b31-88bc-6401265b0a44","kind":"RDF_TYPE","iri":null,"qname":null,"label":"rdf:type","directed":true},{"id":"032cfb03-13f4-364f-8a7d-4250a39d2935","from":"e7bccdc9-d0f7-3000-b733-daa25b9086d8","to":"9c568652-e36e-3b31-88bc-6401265b0a44","kind":"RDF_TYPE","iri":null,"qname":null,"label":"rdf:type","directed":true},{"id":"e5cc7db2-7cad-39b1-8006-0ceac3ede472","from":"865f1956-652e-3992-9218-b7ae2fbec920","to":"2b9d0c00-3a75-3cc1-95ee-db70e18e56e3","kind":"RDF_TYPE","iri":null,"qname":null,"label":"rdf:type","directed":true},{"id":"b0cc6e7e-33d3-3e00-9331-d458e8e22f4e","from":"c0c5535e-210d-3b6b-8ced-feacb2497580","to":"228e6cfd-82f1-3b2c-9a6d-508c0fab92c3","kind":"RDF_TYPE","iri":null,"qname":null,"label":"rdf:type","directed":true},{"id":"6eea8ea1-107c-345b-ab67-390a557aeb49","from":"754e1142-c221-3bf8-a418-bd82133591b8","to":"3bfcc8a0-a1a2-3c14-bd7b-9c3714b53da4","kind":"RDF_TYPE","iri":null,"qname":null,"label":"rdf:type","directed":true},{"id":"41a52dbe-8b0e-3e33-a35f-cb0ad86df46c","from":"344d5d81-80c7-3aef-8067-36924d7be0f6","to":"033ad5af-4c6d-3f8a-9a5c-301621033a29","kind":"RDF_TYPE","iri":null,"qname":null,"label":"rdf:type","directed":true},{"id":"e7bc8f2e-b9ce-32b4-b7d8-9a58c5160915","from":"d2548003-75d5-32a8-8395-27b93985ac47","to":"865f1956-652e-3992-9218-b7ae2fbec920","kind":"OBJECT_PROPERTY","iri":"https://example.com/ontology#isAvailableAt","qname":":isAvailableAt","label":"is available at","directed":true},{"id":"95b28613-18d2-35dd-ab3d-33568acb188c","from":"e7bccdc9-d0f7-3000-b733-daa25b9086d8","to":"c0c5535e-210d-3b6b-8ced-feacb2497580","kind":"OBJECT_PROPERTY","iri":"https://example.com/ontology#requiresConsent","qname":":requiresConsent","label":"requires consent","directed":true},{"id":"fdf186f4-5c02-3696-b97a-9703ba475083","from":"d2548003-75d5-32a8-8395-27b93985ac47","to":"754e1142-c221-3bf8-a418-bd82133591b8","kind":"OBJECT_PROPERTY","iri":"https://example.com/ontology#hasCancellationPolicy","qname":":hasCancellationPolicy","label":"has cancellation policy","directed":true},{"id":"06e10323-68d5-338d-88c0-35e929d2911a","from":"e7bccdc9-d0f7-3000-b733-daa25b9086d8","to":"344d5d81-80c7-3aef-8067-36924d7be0f6","kind":"OBJECT_PROPERTY","iri":"https://example.com/ontology#hasContraindication","qname":":hasContraindication","label":"has contraindication","directed":true}],"page":{"complete":true,"returnedNodes":14,"returnedEdges":12}};

// ===== Трансформер "Онтология" -> "Простой" =====
function transformOntology(input: any) {
  if (!input || !Array.isArray(input.nodes) || !Array.isArray(input.edges)) return null;

  const nodes = input.nodes.map((n: any) => ({
    id: n.id,
    label: n.label || n.qname || n.iri || n.id,
    type: n.kind || "UNKNOWN",
    _raw: n,
  }));

  const links = input.edges.map((e: any) => ({
    source: e.from,
    target: e.to,
    label: e.label || e.qname || e.iri || e.kind,
    kind: e.kind || "EDGE",
    directed: e.directed !== false,
    _raw: e,
  }));

  // дефолтная легенда типов узлов
  const defaultTypes: Record<string, { label: string; color: string }> = {
    CLASS: { label: "Class", color: "#1f77b4" },
    INDIVIDUAL: { label: "Individual", color: "#ff7f0e" },
    UNKNOWN: { label: "Unknown", color: "#999999" },
  };

  return { nodes, links, types: defaultTypes };
}

// ===== Стартовые данные — сразу показываем ваш пример =====
const initialData = transformOntology(sampleOntology);

export default function Graph() {
  const [data] = useState<any>(initialData);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // карта цветов типов узлов
  const typeMap = useMemo(() => {
    const uniqueTypes = Array.from(new Set((data?.nodes ?? []).map((n: any) => n.type)));
    const palette = d3.schemeTableau10.concat(d3.schemeSet3.flat()).filter(Boolean) as string[];

    const autoMap: Record<string, { label: string; color: string }> = {};
    uniqueTypes.forEach((t, i) => {
      // @ts-ignore
      autoMap[t] = { label: t, color: palette[i % palette.length] };
    });

    return {
      ...autoMap,
      ...(data as any)?.types,
    } as Record<string, { label: string; color: string }>;
  }, [data]);

  const colorForNode = (type?: string) => (type && typeMap[type]?.color) || "#999";

  // цвета рёбер по kind
  const edgeKindMap = useMemo(() => {
    const kinds = Array.from(new Set((data?.links ?? []).map((l: any) => l.kind || "EDGE")));
    const palette = d3.schemeSet2 as readonly string[];
    const map: Record<string, string> = {};
    // @ts-ignore
    kinds.forEach((k, i) => (map[k] = palette[i % palette.length]));
    return map;
  }, [data]);
  const colorForEdge = (kind?: string) => (kind && edgeKindMap[kind]) || "#999";

  useEffect((): any => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("* > :not(defs)").remove();
    const g = svg.append("g");


    // zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom as any);

    // defs: arrow marker (edge-colored)
    const defs = svg.append("defs");
// --- background grid patterns ---
    const gridMinor = defs
        .append("pattern")
        .attr("id", "grid-minor")
        .attr("width", 20)
        .attr("height", 20)
        .attr("patternUnits", "userSpaceOnUse");
    gridMinor
        .append("path")
        .attr("d", "M 20 0 L 0 0 0 20")
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb") // slate-200
        .attr("stroke-width", 1);


    const gridMajor = defs
        .append("pattern")
        .attr("id", "grid-major")
        .attr("width", 100)
        .attr("height", 100)
        .attr("patternUnits", "userSpaceOnUse");
    gridMajor
        .append("path")
        .attr("d", "M 100 0 L 0 0 0 100")
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1") // slate-300
        .attr("stroke-width", 1);


    const ensureMarker = (id: string, color: string) => {
      const m = defs
        .append("marker")
        .attr("id", id)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto");
      m.append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
    };

    // создать маркеры для каждого типа ребра
    Object.entries(edgeKindMap).forEach(([k, color]) => ensureMarker(`arrow-${k}`, color));

    const gridBg = g.append("g");
    if ((gridBg as any).lower) gridBg.lower();
    gridBg
        .append("rect")
        .attr("x", -4000)
        .attr("y", -3000)
        .attr("width", 8000)
        .attr("height", 6000)
        .attr("fill", "url(#grid-minor)");
    gridBg
        .append("rect")
        .attr("x", -4000)
        .attr("y", -3000)
        .attr("width", 8000)
        .attr("height", 6000)
        .attr("fill", "url(#grid-major)");

    // links
    const link = g
        .append("g")
        .attr("stroke-width", 1.8)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", (d: any) => colorForEdge(d.kind))
        .attr("marker-end", (d: any) => `url(#arrow-${d.kind})`)
        .attr("stroke-dasharray", (d: any) => (d.kind === "OBJECT_PROPERTY" ? "4 3" : null));

    // link labels
    const linkLabels = g
      .append("g")
      .attr("font-size", 11)
      .attr("fill", "#555")
      .selectAll("text")
      .data(data.links)
      .join("text")
      .attr("dy", -2)
      .text((d: any) => d.label || "");

    // nodes

    const node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => colorForNode(d.type))
      .call(// @ts-ignore
        d3
          .drag<SVGCircleElement, any>()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // node labels
    const labels = g
      .append("g")
      .attr("font-family", "ui-sans-serif, system-ui, -apple-system, Segoe UI")
      .attr("font-size", 12)
      .attr("pointer-events", "none")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", 22)
      .text((d: any) => d.label ?? d.id);

    // simulation
    const sim = d3
      .forceSimulation(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.links as any)
          .id((d: any) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide().radius(24));

    sim.on("tick", () => {
      link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);
      linkLabels
        .attr("x", (d: any) => ((d.source.x ?? 0) + (d.target.x ?? 0)) / 2)
        .attr("y", (d: any) => ((d.source.y ?? 0) + (d.target.y ?? 0)) / 2);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    return () => sim.stop();
  }, [data]);

  return (
      <svg
          ref={svgRef}
          height="100%"
          width="100%"
          viewBox="-400 -300 800 600"
          preserveAspectRatio="xMidYMid meet"
      />
  );
}
