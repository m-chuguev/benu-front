import * as d3 from "d3";
import {NodeDatum, SimpleGraph} from "./util.ts";

export function drawNodes(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    nodes: SimpleGraph["nodes"],
    colorForNode: (type?: string) => string,
    onSelectNode: (id: string) => void,
    sim: d3.Simulation<NodeDatum, undefined>
) {
    const node = g
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll<SVGCircleElement, NodeDatum>("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", d => colorForNode(d.type))
        .style("cursor", "grab")
        .on("click", (_, d) => onSelectNode(d.id))
        .call(
            d3.drag<SVGCircleElement, NodeDatum, NodeDatum>()
                .on("start", (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
                .on("end", (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
        );


    const labels = g
        .append("g")
        .attr("font-family", "ui-sans-serif, system-ui")
        .attr("font-size", 12)
        .attr("pointer-events", "none")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("dy", 22)
        .text(d => d.label ?? d.id);


    const position = () => {
        node.attr("cx", d => d.x ?? 0).attr("cy", d => d.y ?? 0);
        labels.attr("x", d => d.x ?? 0).attr("y", d => d.y ?? 0);
    };

    return { node, labels, position };
}