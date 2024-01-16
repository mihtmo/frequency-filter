import { useContext, useEffect, useRef } from 'react';
import './FFTVisualizer.css';
import AudioContext from '../contexts/AudioContext';

const FFTVisualizer = ({ xScale, yScale, chartDims }) => {
    const [audio] = useContext(AudioContext);
    const requestRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasWrapperRef = useRef(null);

    const audioVisualizerLogic = () => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        canvas.height = chartDims.height;
        canvas.width = chartDims.width;

        const sampleRate = audio.ctx.sampleRate;
        const binCount = audio.analyser.frequencyBinCount;
        // Find number of frequencies each bin expresses
        const freqPerBin = ((sampleRate / 2) / binCount);
        
        const paintCanvas = () => {
            const dataArray = new Float32Array(binCount);
            canvasCtx.clearRect(0, 0, chartDims.width, chartDims.height);
            requestRef.current = requestAnimationFrame(paintCanvas);
            audio.analyser.getFloatFrequencyData(dataArray);
            canvasCtx.lineWidth = 2;
            const strokeColor = window.getComputedStyle(document.querySelector('.theme-wrapper')).getPropertyValue('--fill-color');
            canvasCtx.strokeStyle = strokeColor;
            canvasCtx.beginPath();
            canvasCtx.lineTo(0, chartDims.height);

            for (let i = 0; i < binCount; i++) {
                let freq = freqPerBin * i;
                let x = xScale(freq);
                let sliceHeight = yScale(dataArray[i]);
                canvasCtx.lineTo(x, sliceHeight);
            }
            canvasCtx.lineTo(chartDims.width, chartDims.height);
            canvasCtx.stroke();
            const fillColor = window.getComputedStyle(document.querySelector('.theme-wrapper')).getPropertyValue('--fill-color');
            canvasCtx.fillStyle = fillColor;
            canvasCtx.fill();
        };
        paintCanvas();
    };

    // Run logic on mount (need canvasRef to be available )
    useEffect(() => {
        audioVisualizerLogic();
        return () => cancelAnimationFrame(requestRef.current);
    }, [chartDims, xScale]);

    return (
        <div className='fft-canvas-wrapper' ref={canvasWrapperRef}>
            <canvas className='fft-canvas' ref={canvasRef}/>
        </div>

    )
}

export default FFTVisualizer