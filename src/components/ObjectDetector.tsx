import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as ort from 'onnxruntime-web';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

interface Detection {
    classId: number;
    score: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

const ObjectDetector: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [session, setSession] = useState<ort.InferenceSession | null>(null);
    const [modelLoaded, setModelLoaded] = useState<boolean>(false);
    
    // Lista de clases según tu data.yaml
    const classNames = ['Helmet', 'Mask', 'NO-Helmet', 'NO-Mask', 'NO-Safety Vest', 'Safety Cone', 'Safety Vest'];

    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedSession = await ort.InferenceSession.create('./best.onnx');
                setSession(loadedSession);
                setModelLoaded(true);
                console.log('Modelo ONNX cargado correctamente.');
            } catch (error) {
                console.error('Error al cargar el modelo:', error);
            }
        };
        loadModel();
    }, []);

    const detectObjects = async () => {
        const webcam = webcamRef.current;
        const canvas = canvasRef.current;

        if (!webcam || !canvas || !session) {
            return;
        }

        const video = webcam.video;
        if (!video || video.readyState !== 4) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const tensor = tf.browser.fromPixels(video)
            .resizeBilinear([640, 640])
            .div(255.0)
            .expandDims(0);
        
        const inputData = new Float32Array(tensor.dataSync());
        const feeds: Record<string, ort.Tensor> = { 'images': new ort.Tensor('float32', inputData, [1, 3, 640, 640]) };

        try {
            const results = await session.run(feeds);
            const outputTensor = results.output0;

            if (outputTensor) {
                const outputData = outputTensor.data as Float32Array;

                const detections: Detection[] = [];
                const numDetections = outputTensor.dims[2];
                const numClasses = 7;
                const totalValues = 4 + numClasses; // x, y, w, h + 7 clases

                for (let i = 0; i < numDetections!; i++) {
                    const offset = i * totalValues;
                    const classScores = outputData.slice(offset + 4, offset + 4 + numClasses);
                    const maxScore = Math.max(...classScores);
                    const classId = classScores.indexOf(maxScore);
                    
                    if (maxScore > 0.4) { // Umbral de confianza
                        const box = outputData.slice(offset, offset + 4);
                        const [x, y, w, h] = box;
                        
                        detections.push({
                            classId,
                            score: maxScore,
                            x: x!,
                            y: y!,
                            width: w!,
                            height: h!
                        });
                    }
                }

                detections.forEach(detection => {
                    const { x, y, width, height, score, classId } = detection;
                    
                    const scaleX = canvas.width / 640;
                    const scaleY = canvas.height / 640;
                    
                    const boxX = (x - width / 2) * scaleX;
                    const boxY = (y - height / 2) * scaleY;
                    const boxWidth = width * scaleX;
                    const boxHeight = height * scaleY;

                    context.strokeStyle = '#00FF00';
                    context.lineWidth = 2;
                    context.strokeRect(boxX, boxY, boxWidth, boxHeight);
                    
                    context.fillStyle = '#00FF00';
                    context.font = '18px Arial';
                    const label = `${classNames[classId]} (${(score * 100).toFixed(0)}%)`;
                    context.fillText(label, boxX, boxY > 10 ? boxY - 5 : 10);
                });
            }
        } catch (error) {
            console.error('Error durante la inferencia:', error);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (modelLoaded) {
            interval = setInterval(() => {
                detectObjects();
            }, 100);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [modelLoaded]);

    return (
        <div>
            <h1>Detección de EPP con YOLOv8</h1>
            <div style={{ position: 'relative', width: 640, height: 640, margin: 'auto' }}>
                <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    audio={false}
                    videoConstraints={{ width: 640, height: 640, facingMode: "environment" }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        zIndex: 10,
                    }}
                />
            </div>
        </div>
    );
};

export default ObjectDetector;