import React from 'react';
import { Button, Tooltip } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import './MathSymbolsToolbar.less';

const MathSymbolsToolbar = ({ onSymbolSelect, onClear }) => {
  const mathSymbols = [
    { symbol: 'π', tooltip: 'Pi' },
    { symbol: '√', tooltip: 'Square Root' },
    { symbol: '∞', tooltip: 'Infinity' },
    { symbol: '±', tooltip: 'Plus-Minus' },
    { symbol: '×', tooltip: 'Multiplication' },
    { symbol: '÷', tooltip: 'Division' },
    { symbol: '≤', tooltip: 'Less Than or Equal' },
    { symbol: '≥', tooltip: 'Greater Than or Equal' },
    { symbol: '≠', tooltip: 'Not Equal' },
    { symbol: '∑', tooltip: 'Sum' },
    { symbol: '∫', tooltip: 'Integral' },
    { symbol: '∂', tooltip: 'Partial Derivative' },
    { symbol: '∆', tooltip: 'Delta' },
    { symbol: '∇', tooltip: 'Nabla' },
    { symbol: '∏', tooltip: 'Product' },
    { symbol: '∅', tooltip: 'Empty Set' },
    { symbol: '∈', tooltip: 'Element Of' },
    { symbol: '∉', tooltip: 'Not Element Of' },
    { symbol: '⊂', tooltip: 'Subset Of' },
    { symbol: '⊃', tooltip: 'Superset Of' }
  ];

  return (
    <div className="math-symbols-toolbar">
      {mathSymbols.map(({ symbol, tooltip }) => (
        <Tooltip key={symbol} title={tooltip}>
          <Button
            type="text"
            onClick={() => onSymbolSelect(symbol)}
            className="symbol-button"
          >
            {symbol}
          </Button>
        </Tooltip>
      ))}
      <Tooltip title="Clear Whiteboard">
        <Button
          type="text"
          icon={<ClearOutlined />}
          onClick={onClear}
          className="clear-button"
        />
      </Tooltip>
    </div>
  );
};

export default MathSymbolsToolbar; 