import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Graph, Edge } from "graphlib";
import { read } from "graphlib-dot";
import { SimulationNodeDatum } from "d3";

interface DynamicGraphProps {
  dot: string; // DOT graph string
}

interface Node extends SimulationNodeDatum {
  id: string;
  label: string;
}

const DynamicGraph: React.FC<DynamicGraphProps> = ({ dot }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Parse the DOT input into a graph structure
    const graph: Graph = read(dot);

    // Extract nodes and links
    const nodes: Node[] = graph.nodes().map((id) => ({
      id,
      label: graph.node(id)?.label || id,
    }));

    const links = graph.edges().map((edge: Edge) => ({
      source: edge.v,
      target: edge.w,
    }));

    // SVG dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize D3
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear any existing content

    if (svgRef.current) {
      const svgElement = d3.select<SVGSVGElement, unknown>(svgRef.current);
      svgElement.attr("viewBox", `0 0 ${width} ${height}`).call(
        d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
          svgGroup.attr("transform", event.transform);
        })
      );
    }

    const svgGroup = svg.append("g");

    // Add arrow markers
    svgGroup
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20) // Adjust for proper positioning
      .attr("refY", 0)
      .attr("markerWidth", 8) // Larger for visibility
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Draw links with directional arrows
    const link = svgGroup
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)"); // Attach the arrow marker

    // Define the simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw nodes with customized shapes
    const nodeGroup = svgGroup
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodeGroup.each((d, i, nodes) => {
      const group = d3.select(nodes[i]);
      if (d.label.includes("service")) {
        group
          .append("rect")
          .attr("width", 60)
          .attr("height", 40)
          .attr("y", -20)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("fill", "#3B82F6");
      } else {
        group.append("circle").attr("r", 20).attr("fill", "#6c5ce7");
      }
    });

    // Add labels to nodes
    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 35)
      .attr("font-size", "12px")
      .attr("fill", "#fff")
      .text((d) => d.label);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("color", "#000")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
      .style("display", "none");

    nodeGroup
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(`Node: ${d.label}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY + 5}px`)
          .style("left", `${event.pageX + 5}px`);
      })
      .on("mouseout", () => tooltip.style("display", "none"));

    // Update positions on each tick
    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  }, [dot]);

  return <svg ref={svgRef} width="100%" height="100%" />;
};

export default function PreviewContent() {
  const dot = `
  digraph G {
  rankdir = "RL";
  node [shape = rect, fontname = "sans-serif"];
  "aws_ecr_repository.repo" [label="aws_ecr_repository.repo"];
  "aws_ecs_cluster.cluster" [label="aws_ecs_cluster.cluster"];
  "aws_ecs_service.service" [label="aws_ecs_service.service"];
  "aws_ecs_task_definition.task" [label="aws_ecs_task_definition.task"];
  "aws_iam_role.ecs_task_execution_role" [label="aws_iam_role.ecs_task_execution_role"];
  "aws_iam_role_policy_attachment.ecs_task_execution_role_policy" [label="aws_iam_role_policy_attachment.ecs_task_execution_role_policy"];
  "aws_lb.lb" [label="aws_lb.lb"];
  "aws_lb_listener.listener" [label="aws_lb_listener.listener"];
  "aws_lb_target_group.tg" [label="aws_lb_target_group.tg"];
  "aws_security_group.lb_sg" [label="aws_security_group.lb_sg"];
  "aws_subnet.private" [label="aws_subnet.private"];
  "aws_subnet.public" [label="aws_subnet.public"];
  "aws_vpc.main" [label="aws_vpc.main"];
  "aws_ecs_service.service" -> "aws_ecs_cluster.cluster";
  "aws_ecs_service.service" -> "aws_ecs_task_definition.task";
  "aws_ecs_service.service" -> "aws_lb_target_group.tg";
  "aws_ecs_service.service" -> "aws_security_group.lb_sg";
  "aws_ecs_service.service" -> "aws_subnet.public";
  "aws_ecs_task_definition.task" -> "aws_ecr_repository.repo";
  "aws_ecs_task_definition.task" -> "aws_iam_role.ecs_task_execution_role";
  "aws_iam_role_policy_attachment.ecs_task_execution_role_policy" -> "aws_iam_role.ecs_task_execution_role";
  "aws_lb.lb" -> "aws_security_group.lb_sg";
  "aws_lb.lb" -> "aws_subnet.public";
  "aws_lb_listener.listener" -> "aws_lb.lb";
  "aws_lb_listener.listener" -> "aws_lb_target_group.tg";
  "aws_lb_target_group.tg" -> "aws_vpc.main";
  "aws_security_group.lb_sg" -> "aws_vpc.main";
  "aws_subnet.private" -> "aws_vpc.main";
  "aws_subnet.public" -> "aws_vpc.main";
}
  `;

  return (
    <div className="flex-1 flex items-flex-start justify-flex-start align-flex-start">
      <DynamicGraph dot={dot} />
    </div>
  );
}
