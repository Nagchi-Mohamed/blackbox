import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from 'fabric';
import axios from 'axios';
import { toast } from 'react-toastify';

const Classroom = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 800,
      height: 600,
      backgroundColor: '#ffffff'
    });
    fabricCanvasRef.current = canvas;

    // Load initial state
    const loadInitialState = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/whiteboard/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.data.state) {
          canvas.loadFromJSON(response.data.data.state, () => {
            canvas.renderAll();
          });
        }
      } catch (error) {
        toast.error('Failed to load whiteboard state');
      }
    };

    loadInitialState();

    // Setup event listeners
    canvas.on('path:created', () => {
      saveState();
    });

    canvas.on('object:modified', () => {
      saveState();
    });

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, [id]);

  const saveState = async () => {
    try {
      const token = localStorage.getItem('token');
      const state = JSON.stringify(fabricCanvasRef.current.toJSON());
      await axios.post(`http://localhost:8000/api/whiteboard/${id}`, 
        { state_data: state },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      toast.error('Failed to save whiteboard state');
    }
  };

  return (
    <div className="classroom-container">
      <h2>Classroom {id}</h2>
      <div className="whiteboard-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Classroom; 