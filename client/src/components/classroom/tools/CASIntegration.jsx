import React, { useState } from 'react';
import { Input, Button, Space, Card } from 'antd';
import mathjs from 'mathjs';

export class CASIntegration {
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

  evaluateExpression(expr) {
    try {
      return mathjs.evaluate(expr);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return null;
    }
  }

  solveEquation(equation) {
    try {
      return mathjs.solve(equation, 'x');
    } catch (error) {
      console.error('Error solving equation:', error);
      return null;
    }
  }

  calculateDerivative(expr) {
    try {
      return mathjs.derivative(expr, 'x').toString();
    } catch (error) {
      console.error('Error calculating derivative:', error);
      return null;
    }
  }

  calculateIntegral(expr) {
    try {
      return mathjs.integral(expr, 'x').toString();
    } catch (error) {
      console.error('Error calculating integral:', error);
      return null;
    }
  }
}

const Calculator = ({ onResult }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);

  const handleEvaluate = () => {
    try {
      const value = mathjs.evaluate(expression);
      setResult(value);
      onResult(value);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      setResult('Error');
    }
  };

  return (
    <Card title="Calculator">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter expression..."
        />
        <Button type="primary" onClick={handleEvaluate}>
          Evaluate
        </Button>
        {result !== null && (
          <div className="result">
            Result: {result}
          </div>
        )}
      </Space>
    </Card>
  );
};

export default Calculator; 