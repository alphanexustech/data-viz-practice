import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Heatmap = () => {
  const d3Chart = useRef();

  useEffect(() => {
    drawHeatmap();
  }, []);

  const drawHeatmap = () => {
    // Sample data
    const data = [
      [10, 20, 30, 20, 23, 14, 43],
      [15, 25, 35, 30],
      [20, 30, 40, 50],
      [20, 30, 40],
      [20, 30, 40],
      [20, 30, 40, 54, 45, 21, 56],
    ];

    const gridSize = 100;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = data[0].length * gridSize;
    const height = data.length * gridSize;

    const colorScale = d3.scaleSequential(d3.interpolateGreens)
      .domain([0, 50]);
    const textColorScale = d3.scaleSequential(d3.interpolateOranges)
      .domain([50, 0]);

      //.domain([d3.min(data, row => d3.min(row)), d3.max(data, row => d3.max(row))]);

    const svg = d3.select(d3Chart.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.selectAll('rect')
      .data(data.flat())
      .enter().append('rect')
      .attr('x', (d, i) => (i % data[0].length) * gridSize)
      .attr('y', (d, i) => Math.floor(i / data[0].length) * gridSize)
      .attr('width', gridSize)
      .attr('height', gridSize)
      .attr('fill', d => colorScale(d));
      

    // Optional: Add text for each cell (showing the value)
    svg.selectAll('text')
      .data(data.flat())
      .enter().append('text')
      .attr('x', (d, i) => (i % data[0].length) * gridSize + gridSize / 2)
      .attr('y', (d, i) => Math.floor(i / data[0].length) * gridSize + gridSize / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', d => textColorScale(d))
      .text(d => d);
  };

  return <svg ref={d3Chart}></svg>;
};

function App() {
  return (
    <div className="App">
      <Heatmap />
    </div>
  );
}

export default App;