import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';
import './Whiteboard.css';

const Whiteboard = ({ socket, classroomId, isTeacher }) => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [textInput, setTextInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [fillColor, setFillColor] = useState('transparent');
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    const initCanvas = async () => {
      const canvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: tool === 'pen',
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      });

      // Load initial state
      try {
        const response = await axios.get(`/api/whiteboard/${classroomId}`);
        if (response.data.data.state) {
          canvas.loadFromJSON(response.data.data.state, () => {
            canvas.renderAll();
          });
        }
      } catch (error) {
        console.error('Error loading whiteboard state:', error);
      }

      setIsLoading(false);

      // Setup event listeners
      canvas.on('path:created', (e) => {
        const path = e.path;
        saveToHistory();
        broadcastDrawing(path.toObject(['stroke', 'strokeWidth', 'path']));
      });

      canvas.on('object:added', (e) => {
        if (e.target.type !== 'path') { // Skip paths since they're handled separately
          saveToHistory();
          broadcastDrawing(e.target.toObject());
        }
      });

      canvas.on('object:modified', (e) => {
        saveToHistory();
        broadcastDrawing(e.target.toObject());
      });

      // Handle incoming drawings
      socket.on('whiteboard-draw', (data) => {
        if (data.from !== socket.id) { // Don't process our own drawings
          fabric.util.enlivenObjects([data], (objects) => {
            objects.forEach(obj => canvas.add(obj));
          });
        }
      });

      socket.on('whiteboard-clear', () => {
        canvas.clear();
        saveToHistory();
      });

      // Save canvas reference for cleanup
      const fabricCanvas = canvas;
      return () => {
        fabricCanvas.dispose();
        socket.off('whiteboard-draw');
        socket.off('whiteboard-clear');
      };
    };

    initCanvas();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current && !isLoading) {
        saveStateToServer();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const saveStateToServer = async () => {
    if (canvasRef.current) {
      const state = JSON.stringify(canvasRef.current.toJSON());
      try {
        await axios.post(`/api/whiteboard/${classroomId}`, {
          state_data: state
        });
      } catch (error) {
        console.error('Error saving whiteboard state:', error);
      }
    }
  };

  const loadHistoryState = async (state_id) => {
    try {
      const response = await axios.get(`/api/whiteboard/${classroomId}/history/${state_id}`);
      if (response.data.data.state) {
        canvasRef.current.loadFromJSON(response.data.data.state, () => {
          canvasRef.current.renderAll();
          saveToHistory();
        });
      }
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading history state:', error);
    }
  };

  const fetchHistory = async (query = '') => {
    setIsSearching(true);
    try {
      const response = await axios.get(`/api/whiteboard/${classroomId}/history`, {
        params: { q: query }
      });
      setHistory(response.data.data.history);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory(searchQuery);
  };

  // Update drawing mode when tool changes
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.isDrawingMode = tool === 'pen';
    }
  }, [tool]);

  const broadcastDrawing = (data) => {
    socket.emit('whiteboard-draw', {
      data,
      classroom_id: classroomId,
      from: socket.id
    });
  };

  const saveToHistory = () => {
    if (canvasRef.current) {
      const json = canvasRef.current.toJSON();
      setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
      setHistoryIndex(prev => prev + 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      canvasRef.current.loadFromJSON(history[newIndex], () => {
        canvasRef.current.renderAll();
      });
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      canvasRef.current.loadFromJSON(history[newIndex], () => {
        canvasRef.current.renderAll();
      });
      setHistoryIndex(newIndex);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      socket.emit('whiteboard-clear', { classroom_id: classroomId });
      saveToHistory();
    }
  };

  const addText = () => {
    if (textInput.trim() && canvasRef.current) {
      const text = new fabric.Text(textInput, {
        left: 100,
        top: 100,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: color,
        editable: true
      });
      canvasRef.current.add(text);
      setTextInput('');
    }
  };

  const addShape = (shapeType) => {
    if (!canvasRef.current) return;

    let shape;
    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: fillColor,
          stroke: color,
          strokeWidth: lineWidth
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: fillColor,
          stroke: color,
          strokeWidth: lineWidth
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: fillColor,
          stroke: color,
          strokeWidth: lineWidth
        });
        break;
      case 'line':
        shape = new fabric.Line([50, 50, 200, 50], {
          stroke: color,
          strokeWidth: lineWidth
        });
        break;
      default:
        return;
    }

    canvasRef.current.add(shape);
    canvasRef.current.setActiveObject(shape);
  };

  const saveCanvas = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({
        format: 'png',
        quality: 1
      });
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = dataURL;
      link.click();
    }
  };

  const loadCanvas = (json) => {
    if (canvasRef.current) {
      canvasRef.current.loadFromJSON(json, () => {
        canvasRef.current.renderAll();
        saveToHistory();
      });
    }
  };

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-tools">
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          <option value="pen">Pen</option>
          <option value="text">Text</option>
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
          <option value="line">Line</option>
        </select>

        {tool === 'pen' && (
          <>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
            />
          </>
        )}

        {tool === 'text' && (
          <div className="text-tool">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text"
            />
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              min="8"
              max="72"
            />
            <button onClick={addText}>Add Text</button>
          </div>
        )}

        {['rectangle', 'circle', 'triangle'].includes(tool) && (
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
        )}

        <div className="action-buttons">
          <button onClick={fetchHistory}>History</button>
          <button onClick={undo} disabled={historyIndex <= 0}>Undo</button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</button>
          <button onClick={clearCanvas}>Clear</button>
          <button onClick={saveCanvas}>Save</button>
        </div>
      </div>

      {showHistory && (
        <div className="history-modal">
          <div className="history-content">
            <div className="history-header">
              <h3>Whiteboard History</h3>
              <form onSubmit={handleSearch} className="history-search">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by user or date (YYYY-MM-DD)"
                  disabled={isSearching}
                />
                <button type="submit" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setSearchQuery('');
                    fetchHistory();
                  }}
                  disabled={isSearching}
                >
                  Reset
                </button>
              </form>
            </div>
            
            {isSearching ? (
              <div className="loading-indicator">Loading...</div>
            ) : history.length === 0 ? (
              <div className="no-results">
                {searchQuery ? 'No matching results found' : 'No history available'}
              </div>
            ) : (
              <div className="history-grid">
                {history.map((item) => (
                  <div key={item.state_id} className="history-item">
                    <button 
                      onClick={() => loadHistoryState(item.state_id)}
                      className="history-thumbnail-btn"
                    >
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={`Whiteboard state from ${new Date(item.created_at).toLocaleString()}`}
                          className="history-thumbnail"
                        />
                      ) : (
                        <div className="thumbnail-placeholder">
                          No Preview Available
                        </div>
                      )}
                      <div className="history-meta">
                        <span className="history-date">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                        <span className="history-author">
                          by {item.created_by_name}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setShowHistory(false)}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: '1px solid #000',
          backgroundColor: '#fff',
          cursor: tool === 'pen' ? 'crosshair' : 'default'
        }}
      />
    </div>
  );
};

export default Whiteboard; 