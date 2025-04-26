import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button, Space, Tooltip } from 'antd';
import { 
  CalculatorOutlined, 
  LineChartOutlined, 
  FormOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { LaTeXTool } from './tools/LaTeXTool';
import { CoordinateSystem } from './tools/CoordinateSystem';
import { ConstructionsToolkit } from './tools/ConstructionsToolkit';
import { CASIntegration } from './tools/CASIntegration';

class MathWhiteboard extends fabric.Canvas {
  constructor(element) {
    super(element);
    this.mathTools = {
      equationEditor: new LaTeXTool(this),
      graphPlotter: new CoordinateSystem(this),
      geometry: new ConstructionsToolkit(this),
      calculator: new CASIntegration(this)
    };
    this.collabManager = new OperationalTransform();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.on('object:modified', () => {
      this.collabManager.broadcastChange(this.toJSON());
    });
  }
}

const Whiteboard = ({ classroomId, isTeacher }) => {
  const canvasRef = useRef(null);
  const [whiteboard, setWhiteboard] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const board = new MathWhiteboard(canvasRef.current);
      setWhiteboard(board);
    }
  }, []);

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (whiteboard) {
      whiteboard.mathTools[tool].activate();
    }
  };

  const handleSave = async () => {
    if (whiteboard) {
      const state = whiteboard.toJSON();
      try {
        await fetch(`/api/whiteboard/${classroomId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ state })
        });
      } catch (error) {
        console.error('Failed to save whiteboard state:', error);
      }
    }
  };

  return (
    <div className="math-whiteboard">
      <div className="toolbar">
        <Space>
          <Tooltip title="Equation Editor">
            <Button 
              icon={<FormOutlined />} 
              onClick={() => handleToolSelect('equationEditor')}
              type={activeTool === 'equationEditor' ? 'primary' : 'default'}
            />
          </Tooltip>
          <Tooltip title="Graph Plotter">
            <Button 
              icon={<LineChartOutlined />} 
              onClick={() => handleToolSelect('graphPlotter')}
              type={activeTool === 'graphPlotter' ? 'primary' : 'default'}
            />
          </Tooltip>
          <Tooltip title="Geometry Tools">
            <Button 
              icon={<CalculatorOutlined />} 
              onClick={() => handleToolSelect('geometry')}
              type={activeTool === 'geometry' ? 'primary' : 'default'}
            />
          </Tooltip>
          {isTeacher && (
            <Tooltip title="Save State">
              <Button 
                icon={<SaveOutlined />} 
                onClick={handleSave}
              />
            </Tooltip>
          )}
        </Space>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard; 