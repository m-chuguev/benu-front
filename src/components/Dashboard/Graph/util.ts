import { EdgeDto, GraphDto, NodeDto } from "../../../api";
import type { SimulationNodeDatum } from "d3";

export type NodeDatum = SimulationNodeDatum & {
    id: string;
    label: string;
    type: string;
    _raw: NodeDto;

    degreeIn: number;
    degreeOut: number;
    radius: number;
};

export type LinkDatum = {
    id?: string;
    source: string | NodeDatum;
    target: string | NodeDatum;
    label?: string;
    kind?: string;
    directed: boolean;
    _raw: EdgeDto;
};

export type SimpleGraph = {
    nodes: NodeDatum[];
    links: LinkDatum[];
    types: Record<string, { label: string; color: string }>;
};

export type SizingOptions = {
    base?: number;      // базовый радиус, по умолчанию 8
    scale?: number;     // коэффициент роста, по умолчанию 3
    maxExtra?: number;  // максимум «добавки», по умолчанию 14
    transform?: (k: number) => number; // по умолчанию sqrt
};

export function mapOntology(
    input: GraphDto,
    sizing: SizingOptions = {}
): SimpleGraph | null {
    if (!input || !Array.isArray(input.nodes) || !Array.isArray(input.edges)) return null;

    const degIn = new Map<string, number>();
    const degOut = new Map<string, number>();
    for (const n of input.nodes) {
        degIn.set(n.id, 0);
        degOut.set(n.id, 0);
    }
    for (const e of input.edges) {
        const from = e.from;
        const to = e.to;
        degOut.set(from!, (degOut.get(from!) ?? 0) + 1);
        degIn.set(to!, (degIn.get(to!) ?? 0) + 1);
    }

    const {
        base = 8,
        scale = 10,
        maxExtra = 104,
        transform = (k: number) => Math.sqrt(k),
    } = sizing;

    const radiusFor = (k: number) => base + Math.min(maxExtra, scale * transform(k));

    const nodes: NodeDatum[] = input.nodes.map((n) => {
        const degreeIn = degIn.get(n.id) ?? 0;
        const degreeOut = degOut.get(n.id) ?? 0;
        const radius = radiusFor(degreeIn);

        return {
            id: n.id,
            label: n.label || n.qname || n.iri || n.id,
            type: n.kind || "UNKNOWN",
            _raw: n,
            degreeIn,
            degreeOut,
            radius: radius,
        };
    });

    const links = input.edges.map((e) => ({
        id: e.id || undefined,
        source: e.from,
        target: e.to,
        label: e.label || e.qname || e.iri || e.kind,
        kind: e.kind || "EDGE",
        directed: e.directed !== false,
        _raw: e,
    } as LinkDatum));

    const types: SimpleGraph["types"] = {
        CLASS: { label: "Class",      color: "#1f77b4" },
        INDIVIDUAL: { label: "Individual", color: "#ff7f0e" },
        UNKNOWN: { label: "Unknown",   color: "#999999" },
    };

    return { nodes, links, types };
}
