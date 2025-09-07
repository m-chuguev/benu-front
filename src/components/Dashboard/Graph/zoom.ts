import * as d3 from "d3";

export function installZoom(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, rootG: d3.Selection<SVGGElement, unknown, null, undefined>) {
    const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 5])
        .on("zoom", (event) => rootG.attr("transform", event.transform));

    svg.call(zoom);
}