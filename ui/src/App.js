import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const d3Chart = useRef();

  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    // Sample data
    const data = [
      { category: 'Red', value: 34 },
      { category: 'Blue', value: 12 },
      { category: 'Yellow', value: 23 }
    ];

    const chartWidth = 50;
    const chartHeight = 500;
    const barPadding = 10;
    const barWidth = (chartWidth / data.length);

    const svg = d3.select(d3Chart.current)
                  .attr('width', chartWidth)
                  .attr('height', chartHeight)
                  .style('margin-left', 100);
                
    svg.selectAll('rect')
       .data(data)
       .enter()
       .append('rect')
       .attr('y', (d) => chartHeight - d.value * 10)
       .attr('height', (d) => d.value * 10)
       .attr('width', barWidth - barPadding)
       .attr('transform', (d, i) => {
          let translate = [barWidth * i, 0]; 
          return `translate(${translate})`;
       })
       .attr('fill', (d) => d.category.toLowerCase())
       .attr('stroke', 'white')
       .attr('stroke-width', 3);
  };

  return <svg ref={d3Chart}></svg>;
}

function App() {
  return (
    <div className="App">
      <BarChart />
    </div>
  );
}

export default App;
