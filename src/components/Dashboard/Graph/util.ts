import {EdgeDto, GraphDto, NodeDto} from "../../../api";
import type * as d3 from "d3";

export type NodeDatum = {
    id: string,
    label: string,
    type: string,
    _raw: NodeDto,
} & d3.SimulationNodeDatum

export type LinkDatum = {
    source?: NodeDatum,
    target?: NodeDatum,
    label?: string,
    kind?: string,
    directed: boolean,
    _raw: EdgeDto,
}

export type SimpleGraph = {
    nodes: NodeDatum[];
    links: LinkDatum[];
    types: Record<string, { label: string; color: string }>
}

export function mapOntology(input: GraphDto): SimpleGraph | null {
    if (!input || !Array.isArray(input.nodes) || !Array.isArray(input.edges)) return null;

    const nodes = input.nodes.map(n => ({
        id: n.id,
        label: n.label || n.qname || n.iri || n.id,
        type: n.kind || "UNKNOWN",
        _raw: n,
    }));

    const links = input.edges.map(e => ({
        source: e.from,
        target: e.to,
        label: e.label || e.qname || e.iri || e.kind,
        kind: e.kind || "EDGE",
        directed: e.directed !== false,
        _raw: e,
    } as LinkDatum));

    // легенда, пусть будет пока, собрал из kind
    const defaultTypes: Record<string, { label: string; color: string }> = {
        CLASS: {label: "Class", color: "#1f77b4"},
        INDIVIDUAL: {label: "Individual", color: "#ff7f0e"},
        UNKNOWN: {label: "Unknown", color: "#999999"},
    };

    return {nodes, links, types: defaultTypes};
}