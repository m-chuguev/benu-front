import * as d3 from "d3";


export type TypeMap = Record<string, { label: string; color: string }>;


function palette(): string[] {
    const p1 = (d3.schemeTableau10 as string[]) || [];
    const set3 = d3.schemeSet3 || [];
    const p2 = Array.isArray(set3) ? (set3 as string[][]).flat() : [];
    return [...p1, ...p2].filter(Boolean);
}


/**
 * Построение карты цветов типов узлов (kind/type).
 * auto: уникальные типы из nodes раскрашиваются из палитры d3
 * custom: доп. карта типов из входных данных перекрывает auto
 */
export function buildTypeColorMap(
    nodes: Array<{ type?: string }>,
    custom?: TypeMap
): TypeMap {
    const uniq = Array.from(new Set((nodes || []).map((n) => n.type).filter(Boolean))) as string[];
    const pal = palette();
    const auto: TypeMap = {};
    uniq.forEach((t, i) => {
        auto[t] = { label: t, color: pal[i % pal.length] };
    });
    return { ...auto, ...(custom || {}) };
}


export const colorForNodeFactory = (typeMap: TypeMap) => (type?: string) =>
    (type && typeMap[type]?.color) || "#999";


/**
 * Построение карты цветов для видов рёбер
 */
export function buildEdgeKindColorMap(
    links: Array<{ kind?: string }>
): Record<string, string> {
    const kinds = Array.from(new Set((links || []).map((l) => l.kind || "EDGE")));
    const pal = d3.schemeSet2 as readonly string[];
    const map: Record<string, string> = {};
    kinds.forEach((k, i) => (map[k] = pal[i % pal.length]));
    return map;
}


export const colorForLinkFactory = (edgeKindMap: Record<string, string>) => (kind?: string) =>
    (kind && edgeKindMap[kind]) || "#999";