import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';


const PieChart = () => {
  const chartRef = useRef(null);
  const svgRef = useRef(null);

  const commonData = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19'],
      },
    ],
    labels: [],
  };

  const margin = 20;
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2 - margin;

  useEffect(() => {
    axios.get('http://localhost:3001/budget').then((res) => {
      const updatedData = res.data.myBudget.map((item) => item.budget);
      const updatedLabels = res.data.myBudget.map((item) => item.title);
      commonData.datasets[0].data = updatedData;
      commonData.labels = updatedLabels;

      var ctx = chartRef.current.getContext('2d');
      if (ctx) {
        var myPieChart = new Chart(ctx, {type: 'pie',data: commonData,});
    }

      const svg = d3.select(svgRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const colors = d3.scaleOrdinal()
        .domain(commonData.labels)
        .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']);

      const pie = d3.pie().value((d) => commonData.datasets[0].data[commonData.labels.indexOf(d.Framework)]);

      svg.selectAll('pieces')
        .data(pie(commonData.labels.map((label) => ({ Framework: label }))))
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        )
        .attr('fill', (d) => colors(d.data.Framework))
        .attr('stroke', '#121926')
        .style('stroke-width', '1px');

      const labelLocation = d3.arc()
        .innerRadius(100)
        .outerRadius(radius);

      svg.selectAll('pieces')
        .data(pie(commonData.labels.map((label) => ({ Framework: label }))))
        .enter()
        .append('text')
        .text((d) => d.data.Framework)
        .attr('transform', (d) => `translate(${labelLocation.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', 15);
    });
  }, []);

  return (
    <div>
      <canvas id="myChart" ref={chartRef}></canvas>
      <div ref={svgRef}></div>
    </div>
  );
};

export default PieChart;


