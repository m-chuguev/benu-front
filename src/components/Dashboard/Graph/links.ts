import * as d3 from "d3";
import {SimpleGraph} from "./util.ts";

export function drawLinks(
    rootG: d3.Selection<SVGGElement, unknown, null, undefined>,
    links: SimpleGraph["links"],
    colorForEdge: (kind?: string) => string
) {
    const link = rootG
        .append("g")
        .attr("fill", "none")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1.8)
        .attr("stroke", (d) => colorForEdge(d.kind))
        .attr("marker-end", (d) => `url(#arrow-${d.kind})`)
        .attr("stroke-dasharray", (d) => (d.kind === "OBJECT_PROPERTY" ? "4 3" : null));


    const linkLabels = rootG
        .append("g")
        .attr("font-size", 11)
        .attr("fill", "#555")
        .selectAll("text")
        .data(links)
        .join("text")
        .attr("dy", -2)
        .text((d) => d.label || "");

    const position = () => {
        link
            .attr("x1", d => d.source?.x ?? 0)
            .attr("y1", d => d.source?.y ?? 0)
            .attr("x2", d => d.target?.x ?? 0)
            .attr("y2", d => d.target?.y ?? 0);
        linkLabels
            .attr("x", d => ((d.source?.x ?? 0) + (d.target?.x ?? 0)) / 2)
            .attr("y", d => ((d.source?.y ?? 0) + (d.target?.y ?? 0)) / 2);
    };


    return { link, linkLabels, position };
}