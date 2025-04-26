import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { fabric } from 'fabric';
import MathSymbolsToolbar from './MathSymbolsToolbar';
import './Whiteboard.less';

const Whiteboard = forwardRef(({ initialData, onChange, editable }, ref) => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  // Initialize canvas
  useEffect(() => {
    canvasInstance.current = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: editable,
      width: 800,
      height: 600,
      backgroundColor: 'white'
    });

    // Load initial data if exists
    if (initialData) {
      canvasInstance.current.loadFromJSON(initialData, () => {
        canvasInstance.current.renderAll();
      });
    }

    // Set up event listeners
    canvasInstance.current.on('object:modified', handleCanvasChange);
    canvasInstance.current.on('object:added', handleCanvasChange);
    canvasInstance.current.on('object:removed', handleCanvasChange);

    return () => {
      canvasInstance.current.dispose();
    };
  }, []);

  const handleCanvasChange = () => {
    if (onChange) {
      const data = canvasInstance.current.toJSON();
      onChange(data);
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    updateFromServer: (data) => {
      const currentData = canvasInstance.current.toJSON();
      if (JSON.stringify(currentData) !== JSON.stringify(data)) {
        canvasInstance.current.loadFromJSON(data, () => {
          canvasInstance.current.renderAll();
        });
      }
    },
    clear: () => {
      canvasInstance.current.clear();
      handleCanvasChange();
    },
    addMathSymbol: (symbol) => {
      const text = new fabric.Text(symbol, {
        left: 100,
        top: 100,
        fontSize: 30,
        fontFamily: 'Arial'
      });
      canvasInstance.current.add(text);
      handleCanvasChange();
    }
  }));

  return (
    <div className="whiteboard">
      {editable && (
        <MathSymbolsToolbar 
          onSymbolSelect={(symbol) => ref.current.addMathSymbol(symbol)}
          onClear={() => ref.current.clear()}
        />
      )}
      <canvas ref={canvasRef} />
    </div>
  );
});

export default Whiteboard; 