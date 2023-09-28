import React, { useEffect, useState } from 'react'; // Added useState
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

function PieChart(props) {
    const [data, setData] = useState([
        { label: 'Eat out', value: 30 },
        { label: 'Rent', value: 350 },
        { label: 'Groceries', value: 90 },
    ]);

    const { outerRadius, innerRadius } = props;

    const width = 400;
    const height = 400;

    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateCool)
        .domain([0, data.length]);

    function createChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [
            {
                data: data.map((item) => item.value), 
                backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                ],
            },
            ],
            labels: data.map((item) => item.label), 
        },
        });
    }

    function getBudget() {
        axios.get('http://localhost:3001/budget').then(function (res) {
        console.log(res);
        const newData = randomData(res.data.myBudget);
        setData(newData); 
        createChart(); 
        });
    }

    function randomData (dataSource){
        return dataSource.map(function(data){
        return { label: data.title, value: data.budget }
        });
    }
    useEffect(() => {
        drawChart();
                // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
            
        
            function drawChart() {
                console.log(typeof(width),typeof(height));
                d3.select('#pie-container')
                .select('svg')
                .remove();
            const svg = d3
                .select('#pie-container')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr("transform", "translate(" + 200 + "," + 200 + ")")        
            const arcGenerator = d3
                .arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
        
            const pieGenerator = d3
                .pie()
                .padAngle(0)
                .value((d) => d.value);
        
            const arc = svg
                .selectAll()
                .data(pieGenerator(data))
                .enter();
        
            arc
                .append('path')
                .attr('d', arcGenerator)
                .style('fill', (_, i) => colorScale(i))
                .style('stroke', '#ffffff')
                .style('stroke-width', 0);
        
            arc
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .text((d) => d.data.label)
                .style('fill', (_, i) => colorScale(data.length - i))
                .attr('transform', (d) => {
                const [x, y] = arcGenerator.centroid(d);
                console.log(typeof (x), typeof(y));
                return `translate(${x}, ${y})`;
                });
            }              
            
    return (
        <div id="pie-container">
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    );
}

export default PieChart;