import React, { useState } from 'react';
import { Modal, Input, Button, Select } from 'antd';
import { KatexRenderer } from './KatexRenderer';
import './MathEquationEditor.less';

const { Option } = Select;
const { TextArea } = Input;

const mathSymbols = [
  '\\frac{a}{b}', '\\sqrt{x}', '\\sum_{i=1}^n', '\\int_a^b f(x)dx',
  '\\alpha', '\\beta', '\\gamma', '\\theta', '\\pi', '\\infty'
];

const MathEquationEditor = ({ visible, onInsert, onCancel }) => {
  const [equation, setEquation] = useState('');
  const [preview, setPreview] = useState('');

  const handleInsertSymbol = (symbol) => {
    setEquation(prev => prev + symbol);
  };

  const handlePreview = () => {
    setPreview(equation);
  };

  const handleInsert = () => {
    onInsert(`$${equation}$`);
    setEquation('');
    setPreview('');
  };

  return (
    <Modal
      title="Insert Math Equation"
      open={visible}
      onOk={handleInsert}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="preview" onClick={handlePreview}>
          Preview
        </Button>,
        <Button key="insert" type="primary" onClick={handleInsert}>
          Insert
        </Button>
      ]}
    >
      <div className="math-editor">
        <div className="symbol-palette">
          {mathSymbols.map((symbol, index) => (
            <Button
              key={index}
              type="text"
              onClick={() => handleInsertSymbol(symbol)}
              className="symbol-button"
            >
              <KatexRenderer equation={symbol} />
            </Button>
          ))}
        </div>
        <TextArea
          rows={3}
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="Enter LaTeX equation"
        />
        <div className="preview-area">
          <h4>Preview:</h4>
          {preview && <KatexRenderer equation={preview} />}
        </div>
      </div>
    </Modal>
  );
};

export default MathEquationEditor; 