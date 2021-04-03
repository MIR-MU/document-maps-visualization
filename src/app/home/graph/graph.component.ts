import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import {GraphData} from '../home.component';
import {SimulationLinkDatum, SimulationNodeDatum} from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @Input() data: GraphData;
  @Input() width: number;
  @Input() height: number;
  @Input() minNormValue: number;
  @Input() maxNormValue: number;
  @Input() distanceModifier = 1;
  @Output() nodeClicked = new EventEmitter<any>();
  private svg: any;
  private g: any;
  private simulation: any;
  private zoom: any;

  constructor() { }

  ngOnInit(): void {
    this.initSimulation();
  }

  initSimulation(): void{
    this.simulation = d3.forceSimulation(this.data.nodes);
    // @ts-ignore
    this.simulation.force('link', d3.forceLink(this.data.links).id(d => d.id)
        .distance(link => (this.distanceModifier / link.value - this.distanceModifier)))
        // (link.value - this.minNormValue) / (this.maxNormValue - this.minNormValue)
      .force('charge', d3.forceManyBody()
        .strength(-1))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    this.initSvg();
    this.drawGraph();
  }

  initSvg(): void{
    this.svg = d3.select('figure#graph')
      .append('svg')
      /*.attr('width', this.width)
      .attr('height', this.height);*/
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 960 500');

    this.g = this.svg.append('g');

    this.zoom = d3.zoom()
      .on('zoom', ({transform}) => {
        this.g.attr('transform', transform);
      })
      .extent([[0, 0], [this.width, this.height]])
      .scaleExtent([0.25, 8]);

    this.svg.call(this.zoom);
  }

  drawGraph(): void{
    const link = this.g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(this.data.links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value / 10));

    const node = this.g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.25)
      .selectAll('circle')
      .data(this.data.nodes)
      .join('circle')
      .attr('r', 2)
      .attr('fill', '#ff0000')
      .on('click', (e) => {
        this.nodeClicked.emit(e);
      });

    node.append('title')
      .text(d => d.id);

    this.simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }
}
