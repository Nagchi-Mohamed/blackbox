import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useTranslation } from 'react-i18next';
import { ZoomIn, ZoomOut, Mic, Video, ScreenShare } from 'react-feather';

const Whiteboard = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [mediaState, setMediaState] = useState({
    audio: false,
    video: false,
    screen: false
  });

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      });

      newCanvas.freeDrawingBrush.width = lineWidth;
      newCanvas.freeDrawingBrush.color = color;

      setCanvas(newCanvas);

      return () => {
        newCanvas.dispose();
      };
    }
  }, [color, lineWidth]);

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = color;
    }
  }, [canvas, lineWidth, color]);

  const handleToolChange = (newTool) => {
    setTool(newTool);
    if (canvas) {
      switch (newTool) {
        case 'pen':
          canvas.isDrawingMode = true;
          break;
        case 'eraser':
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.color = '#ffffff';
          break;
        case 'select':
          canvas.isDrawingMode = false;
          break;
        default:
          break;
      }
    }
  };

  const handleClear = () => {
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    }
  };

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
    setZoom(newZoom);
    if (canvas) {
      canvas.setZoom(newZoom);
    }
  };

  return (
    <div className="whiteboard-container">
      <div className="toolbar">
        <button
          className={`tool-button ${tool === 'pen' ? 'active' : ''}`}
          onClick={() => handleToolChange('pen')}
        >
          {t('classroom.tools.pen')}
        </button>
        <button
          className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => handleToolChange('eraser')}
        >
          {t('classroom.tools.eraser')}
        </button>
        <button
          className={`tool-button ${tool === 'select' ? 'active' : ''}`}
          onClick={() => handleToolChange('select')}
        >
          {t('classroom.tools.select')}
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === 'eraser'}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
        />
        <button onClick={handleClear}>
          {t('classroom.tools.clear')}
        </button>
        <button onClick={() => handleZoom('in')}>
          <ZoomIn size={20} />
        </button>
        <button onClick={() => handleZoom('out')}>
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={() => setMediaState({...mediaState, audio: !mediaState.audio})}
          className={mediaState.audio ? 'active' : ''}
        >
          <Mic size={20} color={mediaState.audio ? 'green' : 'red'} />
        </button>
        <button 
          onClick={() => setMediaState({...mediaState, video: !mediaState.video})}
          className={mediaState.video ? 'active' : ''}
        >
          <Video size={20} color={mediaState.video ? 'green' : 'red'} />
        </button>
        <button 
          onClick={() => setMediaState({...mediaState, screen: !mediaState.screen})}
          className={mediaState.screen ? 'active' : ''}
        >
          <ScreenShare size={20} color={mediaState.screen ? 'green' : 'red'} />
        </button>
      </div>
      <canvas ref={canvasRef} style={{ transform: `scale(${zoom})` }} />
    </div>
  );
};

export default Whiteboard; 