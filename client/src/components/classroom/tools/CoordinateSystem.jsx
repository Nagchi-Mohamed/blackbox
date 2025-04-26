import React, { useEffect, useRef } from 'react';
import { Input, Button, Space } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export class CoordinateSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.active = false;
    this.grid = null;
    this.setupGrid();
  }

  setupGrid() {
    const gridSize = 20;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Create vertical lines
    for (let x = 0; x < width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], {
        stroke: '#ccc',
        selectable: false
      });
      this.canvas.add(line);
    }

    // Create horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      const line = new fabric.Line([0, y, width, y], {
        stroke: '#ccc',
        selectable: false
      });
      this.canvas.add(line);
    }

    this.grid = this.canvas.getObjects();
  }

  activate() {
    this.active = true;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
  }

  deactivate() {
    this.active = false;
  }

  plotFunction(fn) {
    const points = [];
    const step = 0.1;
    const range = 10;

    for (let x = -range; x <= range; x += step) {
      try {
        const y = fn(x);
        points.push({ x, y });
      } catch (error) {
        console.error('Error evaluating function:', error);
      }
    }

    const line = new fabric.Polyline(
      points.map(p => ({ x: p.x * 20 + this.canvas.width / 2, y: -p.y * 20 + this.canvas.height / 2 })),
      {
        stroke: 'blue',
        fill: '',
        selectable: false
      }
    );

    this.canvas.add(line);
    this.canvas.renderAll();
  }
}

const GraphPlotter = ({ onPlot }) => {
  const [functionString, setFunctionString] = useState('');

  const handlePlot = () => {
    try {
      const fn = new Function('x', `return ${functionString}`);
      onPlot(fn);
    } catch (error) {
      console.error('Invalid function:', error);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input
        value={functionString}
        onChange={(e) => setFunctionString(e.target.value)}
        placeholder="Enter function (e.g., x^2)"
      />
      <Button type="primary" onClick={handlePlot}>
        Plot Function
      </Button>
    </Space>
  );
};

export default GraphPlotter; 