import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Heatmap = () => {
  const d3Chart = useRef();
  const [data, setData] = useState([
    [
      [10, 10, 10, 10],
      [10, 10, 10, 10],
      [10, 10, 10, 10],
      [10, 10,10, 10],
    ],
    [
      [10, 10, 10, 10],
      [10, 10, 10, 10],
      [10, 10, 10, 10],
      [10, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],

    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ]);

  useEffect(() => {
    drawHeatmap();
  }, [data]);

  const drawHeatmap = () => {
    // Clear the SVG on each redraw
    d3.select(d3Chart.current).selectAll('*').remove();
  
    const gridSize = 30;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = data[0][0].length * gridSize;
    const height = data[0].length * gridSize;
  
    // Find the maximum value across the 3D tensor for each corresponding cell position
    const findWinners = () => {
      const winners = [];
  
      for (let y = 0; y < data[0].length; y++) {
        const row = [];
        for (let x = 0; x < data[0][0].length; x++) {
          let cellMax = 0;
          let winningIndex = -1;
          for (let z = 0; z < data.length; z++) {
            if (data[z][y][x] > cellMax) {
              cellMax = data[z][y][x];
              winningIndex = z;
            }
          }
          row.push(winningIndex);
        }
        winners.push(row);
      }
  
      return winners;
    };
  
    const winningIndices = findWinners();
  
    // Create an array of unique winning values to assign unique colors
    const uniqueWinningValues = Array.from(new Set(winningIndices.flat()));
  
    // Create color scales for each winning value
    const colorScales = {};
    uniqueWinningValues.forEach((value, index) => {
      console.log(value)
      colorScales[value] = d3.scaleSequential(["green", "purple"]).domain([0, uniqueWinningValues.length - 1]).clamp(true);
    });
  
    const svg = d3
      .select(d3Chart.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Inside the drawHeatmap function
    winningIndices.forEach((row, y) => {
      row.forEach((winningIndex, x) => {
        if (data[winningIndex] && data[winningIndex][y] && data[winningIndex][y][x] !== undefined) {
          svg
            .append('rect')
            .attr('x', x * gridSize)
            .attr('y', y * gridSize)
            .attr('width', gridSize)
            .attr('height', gridSize)
            .attr('fill', colorScales[winningIndex](winningIndex));

          svg
            .append('text')
            .attr('x', x * gridSize + gridSize / 2)
            .attr('y', y * gridSize + gridSize / 2)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', 'white') // You may adjust the text color as needed
            .text(data[winningIndex][y][x]);
        } else {
          console.error(`Undefined or empty value at index (${winningIndex}, ${y}, ${x})`);
        }
      });
    });
  };
  
const handleRandomButtonClick = () => {
  const newData = JSON.parse(JSON.stringify(data)); // Create a deep copy of the original data

  const cellsToUpdate = 1000;
  const depth = newData.length;
  const rows = newData[0].length;
  const cols = newData[0][0].length;

  for (let i = 0; i < cellsToUpdate; i++) {
    const depthIndex = Math.floor(Math.random() * depth);
    const rowIndex = Math.floor(Math.random() * rows);
    const colIndex = Math.floor(Math.random() * cols);

    newData[depthIndex][rowIndex][colIndex] += 1;
  }

  setData(newData); // Update the state with modified data
};

const handleResetButtonClick = () => {
  // Create a new 3D array with the same dimensions as the original data, all cells set to zero
  const resetData = Array.from({ length: data.length }, () =>
    Array.from({ length: data[0].length }, () => Array(data[0][0].length).fill(0))
  );

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
