import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { AgoraRTC } from 'agora-rtc-sdk-ng';
import { Box, IconButton, Stack, Tooltip, Typography, Slider, Button } from '@mui/material';
import {
  Mic, MicOff, Videocam, VideocamOff,
  ScreenShare, StopScreenShare,
  Brush, Undo, Redo, ClearAll,
  Palette, ZoomIn, ZoomOut
} from '@mui/icons-material';

const Whiteboard = ({ roomId }) => {
  // State management
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Refs
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const clientRef = useRef(null);

  // Initialize video call with error handling
  useEffect(() => {
    const initVideoCall = async () => {
      try {
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = client;
        
        await client.join(process.env.AGORA_APP_ID, roomId, null);
        const stream = await AgoraRTC.createStream({
          audio: true,
          video: true,
        });
        
        await stream.init();
        setLocalStream(stream);
        
        client.on('stream-added', (evt) => {
          client.subscribe(evt.stream);
        });
        
        client.on('stream-subscribed', (evt) => {
          setRemoteStreams(prev => [...prev, evt.stream]);
        });
        
        client.on('stream-removed', (evt) => {
          setRemoteStreams(prev => prev.filter(s => s.getId() !== evt.stream.getId()));
        });
        
      } catch (error) {
        console.error('Video initialization error:', error);
      }
    };

    initVideoCall();
    return () => {
      localStream?.close();
      clientRef.current?.leave();
    };
  }, [roomId]);

  // Enhanced whiteboard initialization
  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      selection: false
    });

    // Set initial drawing tools
    fabricCanvas.current.freeDrawingBrush.color = brushColor;
    fabricCanvas.current.freeDrawingBrush.width = brushWidth;

    // Handle window resize
    const handleResize = () => {
      fabricCanvas.current.setDimensions({
        width: '100%',
        height: '100%'
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      fabricCanvas.current.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Screen sharing implementation
  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        // Stop screen sharing
        localStream.getVideoTrack().enabled = true;
        setIsSharingScreen(false);
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        localStream.getVideoTrack().enabled = false;
        clientRef.current.publish(screenStream);
        setIsSharingScreen(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  // Whiteboard tools functions
  const changeBrushColor = (color) => {
    setBrushColor(color);
    fabricCanvas.current.freeDrawingBrush.color = color;
  };

  const changeBrushWidth = (width) => {
    setBrushWidth(width);
    fabricCanvas.current.freeDrawingBrush.width = width;
  };

  const undoDrawing = () => {
    if (fabricCanvas.current._objects.length > 0) {
      fabricCanvas.current._objects.pop();
      fabricCanvas.current.renderAll();
    }
  };

  const clearCanvas = () => {
    fabricCanvas.current.clear();
    fabricCanvas.current.backgroundColor = '#ffffff';
    fabricCanvas.current.renderAll();
  };

  const zoomCanvas = (direction) => {
    const newZoom = direction === 'in' ? zoomLevel * 1.2 : zoomLevel / 1.2;
    setZoomLevel(Math.max(0.5, Math.min(newZoom, 3)));
    fabricCanvas.current.setZoom(newZoom);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      bgcolor: 'background.default',
      p: { xs: 1, md: 2 },
      gap: 2
    }}>
      {/* Video Conference Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        height: { xs: 'auto', md: '30%' }
      }}>
        {/* Local Video */}
        <Box sx={{
          flex: 1,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          position: 'relative',
          minHeight: 200,
          bgcolor: 'background.paper'
        }}>
          {localStream && (
            <>
              <video 
                autoPlay 
                muted 
                ref={video => video && (video.srcObject = localStream)}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  backgroundColor: '#212121',
                  display: isVideoOff ? 'none' : 'block'
                }}
              />
              {isVideoOff && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="h6" color="text.secondary">
                    Camera Off
                  </Typography>
                </Box>
              )}
              <Stack direction="row" spacing={1} sx={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                borderRadius: 4,
                p: 1,
                backdropFilter: 'blur(10px)'
              }}>
                <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                  <IconButton 
                    onClick={toggleAudio} 
                    color={isMuted ? "error" : "inherit"}
                    sx={{ color: 'white' }}
                  >
                    {isMuted ? <MicOff /> : <Mic />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isVideoOff ? "Start Video" : "Stop Video"}>
                  <IconButton 
                    onClick={toggleVideo} 
                    color={isVideoOff ? "error" : "inherit"}
                    sx={{ color: 'white' }}
                  >
                    {isVideoOff ? <VideocamOff /> : <Videocam />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isSharingScreen ? "Stop Sharing" : "Share Screen"}>
                  <IconButton 
                    onClick={toggleScreenShare}
                    color={isSharingScreen ? "error" : "inherit"}
                    sx={{ color: 'white' }}
                  >
                    {isSharingScreen ? <StopScreenShare /> : <ScreenShare />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </>
          )}
        </Box>

        {/* Remote Videos */}
        <Box sx={{
          flex: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          overflow: 'auto',
          p: 1,
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          {remoteStreams.map((stream, index) => (
            <Box key={index} sx={{
              flex: { xs: '1 1 100%', sm: '1 1 45%' },
              minWidth: 300,
              maxWidth: { xs: '100%', sm: '45%' },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              position: 'relative',
              height: 200,
              bgcolor: 'background.paper'
            }}>
              <video 
                autoPlay 
                ref={video => video && (video.srcObject = stream)}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  backgroundColor: '#212121'
                }}
              />
              <Typography variant="caption" sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                px: 1,
                borderRadius: 1
              }}>
                Participant {index + 1}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Whiteboard Section */}
      <Box sx={{
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}>
        {/* Enhanced Whiteboard Tools */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Tooltip title="Brush">
              <IconButton>
                <Palette />
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo">
              <IconButton onClick={undoDrawing}>
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear">
              <IconButton onClick={clearCanvas}>
                <ClearAll />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom In">
              <IconButton onClick={() => zoomCanvas('in')}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton onClick={() => zoomCanvas('out')}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Color:</Typography>
              <input 
                type="color" 
                value={brushColor}
                onChange={(e) => changeBrushColor(e.target.value)}
                style={{ 
                  width: 30, 
                  height: 30, 
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: '4px'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Size:</Typography>
              <Slider
                value={brushWidth}
                onChange={(e, value) => changeBrushWidth(value)}
                min={1}
                max={20}
                sx={{ width: 100 }}
              />
            </Box>
          </Stack>
        </Box>
        
        {/* Canvas Container */}
        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <canvas 
            ref={canvasRef} 
            style={{ 
              width: '100%', 
              height: '100%',
              cursor: 'crosshair',
              touchAction: 'none'
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Whiteboard;