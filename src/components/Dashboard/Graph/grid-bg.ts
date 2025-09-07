import * as d3 from "d3";

const borderColorX20 = '#e5e7eb';
const borderColorX100 = '#cbd5e1';

export function addGridDefs(svg:  d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    const defs = svg.append("defs");

    const x20Cell = defs.append("pattern").attr("id", "grid-x20Cell").attr("width", 20).attr("height", 20).attr("patternUnits", "userSpaceOnUse");
    x20Cell.append("path").attr("d", "M 20 0 L 0 0 0 20").attr("fill", "none").attr("stroke", borderColorX20).attr("stroke-width", 1);

    const x100Cell = defs.append("pattern").attr("id", "grid-x100Cell").attr("width", 100).attr("height", 100).attr("patternUnits", "userSpaceOnUse");
    x100Cell.append("path").attr("d", "M 100 0 L 0 0 0 100").attr("fill", "none").attr("stroke", borderColorX100).attr("stroke-width", 1);
}

export function addGridBackground(rootG: d3.Selection<SVGGElement, unknown, null, undefined>) {
    const bg = rootG.append("g");

    bg.lower?.();
    bg.append("rect").attr("x", -4000).attr("y", -3000).attr("width", 8000).attr("height", 6000).attr("fill", "url(#grid-x20Cell)");
    bg.append("rect").attr("x", -4000).attr("y", -3000).attr("width", 8000).attr("height", 6000).attr("fill", "url(#grid-x100Cell)");
}