import React, { useState } from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  LineOutlined,
  CircleOutlined,
  SquareOutlined,
  CompassOutlined
} from '@ant-design/icons';

export class ConstructionsToolkit {
  constructor(canvas) {
    this.canvas = canvas;
    this.active = false;
    this.currentTool = null;
  }

  activate() {
    this.active = true;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
  }

  deactivate() {
    this.active = false;
    this.currentTool = null;
  }

  setTool(tool) {
    this.currentTool = tool;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    switch (tool) {
      case 'line':
        this.setupLineTool();
        break;
      case 'circle':
        this.setupCircleTool();
        break;
      case 'rectangle':
        this.setupRectangleTool();
        break;
      case 'compass':
        this.setupCompassTool();
        break;
    }
  }

  setupLineTool() {
    this.canvas.on('mouse:down', (options) => {
      const pointer = this.canvas.getPointer(options.e);
      const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: 'black',
        selectable: false
      });
      this.canvas.add(line);

      this.canvas.on('mouse:move', (options) => {
        const pointer = this.canvas.getPointer(options.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        this.canvas.renderAll();
      });

      this.canvas.on('mouse:up', () => {
        this.canvas.off('mouse:move');
        this.canvas.off('mouse:up');
      });
    });
  }

  setupCircleTool() {
    this.canvas.on('mouse:down', (options) => {
      const pointer = this.canvas.getPointer(options.e);
      const circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: '',
        stroke: 'black',
        selectable: false
      });
      this.canvas.add(circle);

      this.canvas.on('mouse:move', (options) => {
        const pointer = this.canvas.getPointer(options.e);
        const radius = Math.sqrt(
          Math.pow(pointer.x - circle.left, 2) +
          Math.pow(pointer.y - circle.top, 2)
        );
        circle.set({ radius });
        this.canvas.renderAll();
      });

      this.canvas.on('mouse:up', () => {
        this.canvas.off('mouse:move');
        this.canvas.off('mouse:up');
      });
    });
  }

  setupRectangleTool() {
    this.canvas.on('mouse:down', (options) => {
      const pointer = this.canvas.getPointer(options.e);
      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: '',
        stroke: 'black',
        selectable: false
      });
      this.canvas.add(rect);

      this.canvas.on('mouse:move', (options) => {
        const pointer = this.canvas.getPointer(options.e);
        rect.set({
          width: pointer.x - rect.left,
          height: pointer.y - rect.top
        });
        this.canvas.renderAll();
      });

      this.canvas.on('mouse:up', () => {
        this.canvas.off('mouse:move');
        this.canvas.off('mouse:up');
      });
    });
  }

  setupCompassTool() {
    // Implement compass tool for angle measurements
  }
}

const GeometryTools = ({ onToolSelect }) => {
  return (
    <Space>
      <Tooltip title="Line">
        <Button 
          icon={<LineOutlined />} 
          onClick={() => onToolSelect('line')}
        />
      </Tooltip>
      <Tooltip title="Circle">
        <Button 
          icon={<CircleOutlined />} 
          onClick={() => onToolSelect('circle')}
        />
      </Tooltip>
      <Tooltip title="Rectangle">
        <Button 
          icon={<SquareOutlined />} 
          onClick={() => onToolSelect('rectangle')}
        />
      </Tooltip>
      <Tooltip title="Compass">
        <Button 
          icon={<CompassOutlined />} 
          onClick={() => onToolSelect('compass')}
        />
      </Tooltip>
    </Space>
  );
};

export default GeometryTools; 