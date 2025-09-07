import * as d3 from "d3";

export function ensureMarker(defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, id: string, color: string) {
    const m = defs.append("marker").attr("id", id).attr("viewBox", "0 -5 10 10").attr("refX", 20).attr("refY", 0)
        .attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto");
    m.append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
}