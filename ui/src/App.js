import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';


const Heatmap = () => {
  const d3Chart = useRef();
  const [data, setData] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  useEffect(() => {
    drawHeatmap();
  }, [data]);

  const drawHeatmap = () => {
    // Clear the SVG on each redraw
    d3.select(d3Chart.current).selectAll('*').remove();

    const gridSize = 100;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = data[0].length * gridSize;
    const height = data.length * gridSize;

    // Function to find the maximum value in a list of lists
    const findMaxValue = (data) => {
      let maxValue = 1;
      data.forEach(list => {
        const maxInList = Math.max(...list);
        if (maxInList > maxValue) {
          maxValue = maxInList;
        }
      });
      return maxValue;
    };

    // Find the maximum value in the data
    const maxValue = findMaxValue(data);

    // Update colorScale and textColorScale with the maximum value
    const colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, maxValue]);
    const textColorScale = d3.scaleSequential(d3.interpolateOranges).domain([maxValue, 0]);

    // Now, colorScale and textColorScale are updated with the maximum value from the data

    const svg = d3
      .select(d3Chart.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg
      .selectAll('rect')
      .data(data.flat())
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % data[0].length) * gridSize)
      .attr('y', (d, i) => Math.floor(i / data[0].length) * gridSize)
      .attr('width', gridSize)
      .attr('height', gridSize)
      .attr('fill', d => colorScale(d));

    svg
      .selectAll('text')
      .data(data.flat())
      .enter()
      .append('text')
      .attr('x', (d, i) => (i % data[0].length) * gridSize + gridSize / 2)
      .attr('y', (d, i) => Math.floor(i / data[0].length) * gridSize + gridSize / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', d => textColorScale(d))
      .text(d => d);
  };

  const handleRandomButtonClick = () => {
    const newData = [...data]; // Create a copy of the original data
    const cellsToUpdate = 100;

    for (let i = 0; i < cellsToUpdate; i++) {
      const rowIndex = Math.floor(Math.random() * data.length);
      const colIndex = Math.floor(Math.random() * data[rowIndex].length);

      newData[rowIndex][colIndex] += 1;
    }

    setData(newData); // Update the state with modified data
  };

  const handleResetButtonClick = () => {
    // Create a new array with the same dimensions as the original data, all cells set to zero
    const resetData = data.map(row => row.map(() => 0));
    setData(resetData); // Set the state with the reset data
  };

  return (
    <div>
      <div
        style={{
          padding: '10px',
          margin: '5px',
          backgroundColor: 'blue',
          color: 'white',
          cursor: 'pointer',
          display: 'inline-block',
          borderRadius: '5px',
        }}
        onClick={handleRandomButtonClick}
      >
        Increment Random Value
      </div>
      <div
        style={{
          padding: '10px',
          margin: '5px',
          backgroundColor: 'red',
          color: 'white',
          cursor: 'pointer',
          display: 'inline-block',
          borderRadius: '5px',
        }}
        onClick={handleResetButtonClick}
      >
        Reset All Cells to Zero
      </div>
      <svg ref={d3Chart}></svg>
    </div>
  );
  };

function App() {
  return (
    <div className="App">
      <Heatmap />
    </div>
  );
}

export default App;
