import { useRef, useEffect, useState } from 'react';
import * as ort from 'onnxruntime-web';

const YOLOv8ObjectDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<ort.InferenceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Configuración del modelo
  const MODEL_PATH = '/best2.onnx';
  const CLASSES = ['clase1', 'clase2', 'clase3', 'clase4', 'clase5', 'clase6', 'clase7'];

  // Dimensiones del modelo
  const MODEL_WIDTH = 640;
  const MODEL_HEIGHT = 640;
  const CONFIDENCE_THRESHOLD = 0.5;
  const NMS_THRESHOLD = 0.5;

  useEffect(() => {
    initModel();
    // Solo intentar iniciar la cámara si mediaDevices está disponible
    if (navigator.mediaDevices) {
      startCamera();
    } else {
      setCameraError('Camera API not supported in this browser');
    }
  }, []);

  const initModel = async () => {
    try {
      ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
      const session = await ort.InferenceSession.create(MODEL_PATH);
      setModel(session);
      setLoading(false);
    } catch (err) {
      setError('Error loading model');
      console.error('Model loading error:', err);
    }
  };

  const startCamera = async () => {
    try {
      // Verificar que mediaDevices existe
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not available');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Usar cámara trasera si está disponible
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Esperar a que el video esté listo
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        };
      }
    } catch (err) {
      const errorMessage = getCameraErrorMessage(err);
      setCameraError(errorMessage);
      console.error('Camera access error:', err);
    }
  };

  // Función para obtener mensajes de error más descriptivos
  const getCameraErrorMessage = (error: any): string => {
    if (error.name === 'NotAllowedError') {
      return 'Camera access denied. Please allow camera permissions.';
    } else if (error.name === 'NotFoundError') {
      return 'No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
      return 'Camera is already in use by another application.';
    } else if (error.name === 'OverconstrainedError') {
      return 'Camera does not support the requested constraints.';
    } else if (error.name === 'SecurityError') {
      return 'Camera access is blocked for security reasons. Use HTTPS or localhost.';
    } else {
      return `Error accessing camera: ${error.message}`;
    }
  };

  const calculateIOU = (box1: any, box2: any) => {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);
    
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const area1 = box1.width * box1.height;
    const area2 = box2.width * box2.height;
    const union = area1 + area2 - intersection;
    
    return union > 0 ? intersection / union : 0;
  };

  const applyNMS = (boxes: any[], iouThreshold: number) => {
    boxes.sort((a, b) => b.confidence - a.confidence);
    
    const selectedBoxes: any[] = [];
    
    while (boxes.length > 0) {
      const currentBox = boxes.shift()!;
      selectedBoxes.push(currentBox);
      
      for (let i = boxes.length - 1; i >= 0; i--) {
        const iou = calculateIOU(currentBox, boxes[i]);
        if (iou > iouThreshold) {
          boxes.splice(i, 1);
        }
      }
    }
    
    return selectedBoxes;
  };

  const detectObjects = async () => {
    if (!model || !videoRef.current || !canvasRef.current || videoRef.current.videoWidth === 0) return;
  
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
  
    try {
      const input = preprocessFrame(videoRef.current);
      const tensor = new ort.Tensor('float32', input, [1, 3, MODEL_WIDTH, MODEL_HEIGHT]);
  
      const results = await model.run({ images: tensor });
      const output = results.output0!.data;
      const outputDims = results.output0!.dims;
      
      // DEBUG: Ver la estructura real de la salida
      console.log('=== DEBUG OUTPUT ===');
      console.log('Output dimensions:', outputDims);
      console.log('Output length:', output.length);

      
      // Post-procesamiento
      const boxes = processOutput(output, outputDims as number [], videoRef.current.videoWidth, videoRef.current.videoHeight);
      console.log('Raw boxes:', boxes);
      
      const filteredBoxes = applyNMS(boxes, NMS_THRESHOLD);
      console.log('Filtered boxes:', filteredBoxes);
  
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawBoxes(ctx, filteredBoxes);
    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  const preprocessFrame = (video: HTMLVideoElement): Float32Array => {
    const canvas = document.createElement('canvas');
    canvas.width = MODEL_WIDTH;
    canvas.height = MODEL_HEIGHT;
    const ctx = canvas.getContext('2d')!;
    
    ctx.drawImage(video, 0, 0, MODEL_WIDTH, MODEL_HEIGHT);
    const imageData = ctx.getImageData(0, 0, MODEL_WIDTH, MODEL_HEIGHT);
    
    const input = new Float32Array(3 * MODEL_WIDTH * MODEL_HEIGHT);
    for (let i = 0; i < imageData.data.length; i += 4) {
      input[i / 4] = imageData.data[i]! / 255.0;
      input[i / 4 + MODEL_WIDTH * MODEL_HEIGHT] = imageData.data[i + 1]! / 255.0;
      input[i / 4 + 2 * MODEL_WIDTH * MODEL_HEIGHT] = imageData.data[i + 2]! / 255.0;
    }
    
    return input;
  };

  // Código React actualizado para YOLOv8

  const processOutput = (output: any, outputDims: number[] | undefined, videoWidth: number, videoHeight: number) => {
    const boxes = [];
    
    console.log('Output dims:', outputDims);
    console.log('Output length:', output.length);
    
    // Si no tenemos dimensions, intentamos inferir la estructura
    if (!outputDims || outputDims.length === 0) {
      console.log('No dimensions provided, trying to infer structure...');
      
      // YOLOv8 generalmente tiene 8400 detecciones con 4 + nc valores cada una
      const expectedValuesPerDetection = 4 + CLASSES.length; // 11
      const numDetections = output.length / expectedValuesPerDetection;
      
      if (Number.isInteger(numDetections)) {
        console.log('Inferred structure: 1 detection =', expectedValuesPerDetection, 'values');
        
        for (let i = 0; i < numDetections; i++) {
          const offset = i * expectedValuesPerDetection;
          
          const cx = output[offset];
          const cy = output[offset + 1];
          const w = output[offset + 2];
          const h = output[offset + 3];
          const objectness = output[offset + 4];
          
          if (objectness < CONFIDENCE_THRESHOLD) continue;
  
          // Encontrar la clase con mayor score
          let maxScore = 0;
          let classId = 0;
          for (let j = 0; j < CLASSES.length; j++) {
            const score = output[offset + 5 + j];
            if (score > maxScore) {
              maxScore = score;
              classId = j;
            }
          }
  
          const confidence = objectness * maxScore;
          if (confidence < CONFIDENCE_THRESHOLD) continue;
  
          // Convertir a coordenadas de píxeles
          const x = (cx - w / 2) * videoWidth;
          const y = (cy - h / 2) * videoHeight;
          const width = w * videoWidth;
          const height = h * videoHeight;
  
          // Filtrar boxes inválidas
          if (width > 5 && height > 5 && x < videoWidth && y < videoHeight) {
            boxes.push({
              x: Math.max(0, x),
              y: Math.max(0, y),
              width: Math.min(width, videoWidth - x),
              height: Math.min(height, videoHeight - y),
              class: CLASSES[classId],
              confidence: confidence
            });
          }
        }
      }
      return boxes;
    }
  
    // Si tenemos dimensions, procesar según la estructura conocida
    const [batchSize, numChannels, numAnchors] = outputDims;
    console.log('Processing with dims:', batchSize, numChannels, numAnchors);
    
    // Para YOLOv8: [1, 11, 8400] donde 11 = 4 (coord) + 7 (clases)
    for (let i = 0; i < numAnchors!; i++) {
      // Obtener el score de objeto (confidence)
      const objectness = output[i + 4 * numAnchors!];
      
      if (objectness < CONFIDENCE_THRESHOLD) continue;
  
      // Encontrar la clase con mayor score
      let maxClassScore = 0;
      let classId = -1;
      
      for (let j = 0; j < CLASSES.length; j++) {
        const classScore = output[i + (4 + j) * numAnchors!];
        if (classScore > maxClassScore) {
          maxClassScore = classScore;
          classId = j;
        }
      }
  
      const confidence = objectness * maxClassScore;
      if (confidence < CONFIDENCE_THRESHOLD || classId === -1) continue;
  
      // Obtener coordenadas [cx, cy, w, h] normalizadas
      const cx = output[i + 0 * numAnchors!];
      const cy = output[i + 1 * numAnchors!];
      const w = output[i + 2 * numAnchors!];
      const h = output[i + 3 * numAnchors!];
  
      // Convertir a coordenadas de píxeles
      const x = (cx - w / 2) * videoWidth;
      const y = (cy - h / 2) * videoHeight;
      const width = w * videoWidth;
      const height = h * videoHeight;
  
      // Filtrar boxes inválidas
      if (width > 0 && height > 0 && x < videoWidth && y < videoHeight) {
        boxes.push({
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: Math.min(width, videoWidth - x),
          height: Math.min(height, videoHeight - y),
          class: CLASSES[classId],
          confidence: confidence
        });
      }
    }
    
    return boxes;
  };

  const drawBoxes = (ctx: CanvasRenderingContext2D, boxes: any[]) => {
    ctx.lineWidth = 3;
    ctx.font = '18px Arial';

    boxes.forEach(box => {
      ctx.strokeStyle = '#00FF00';
      ctx.fillStyle = '#00FF00';
      
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
      const text = `${box.class} (${(box.confidence * 100).toFixed(1)}%)`;
      const textWidth = ctx.measureText(text).width;
      
      ctx.fillRect(box.x - 2, box.y - 25, textWidth + 4, 25);
      ctx.fillStyle = '#000';
      ctx.fillText(text, box.x, box.y - 5);
    });
  };

  useEffect(() => {
    if (!model || !videoRef.current) return;

    const detectFrame = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        detectObjects();
      }
      requestAnimationFrame(detectFrame);
    };

    const animationId = requestAnimationFrame(detectFrame);
    return () => cancelAnimationFrame(animationId);
  }, [model]);

  if (loading) return <div>Loading model...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ 
          display: 'block', 
          width: '100%', 
          borderRadius: '8px',
          border: cameraError ? '2px solid red' : 'none'
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '8px'
        }}
      />
      
      {cameraError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          maxWidth: '80%'
        }}>
          <h3>Camera Error</h3>
          <p>{cameraError}</p>
          <button 
            onClick={startCamera}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && !cameraError && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          Detecting objects...
        </div>
      )}
    </div>
  );
};

export default YOLOv8ObjectDetection;