import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export class LaTeXTool {
  constructor(canvas) {
    this.canvas = canvas;
    this.active = false;
  }

  activate() {
    this.active = true;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
  }

  deactivate() {
    this.active = false;
  }

  async insertEquation(latex) {
    try {
      const html = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false
      });

      const text = new fabric.Text(html, {
        left: 100,
        top: 100,
        fontSize: 20,
        fontFamily: 'KaTeX_Main'
      });

      this.canvas.add(text);
      this.canvas.renderAll();
    } catch (error) {
      console.error('Failed to render LaTeX:', error);
    }
  }
}

const LaTeXEditor = ({ onInsert }) => {
  const [latex, setLatex] = useState('');

  const handleInsert = () => {
    if (latex.trim()) {
      onInsert(latex);
      setLatex('');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="Enter LaTeX equation..."
        rows={4}
      />
      <Button type="primary" onClick={handleInsert}>
        Insert Equation
      </Button>
    </Space>
  );
};

export default LaTeXEditor; 