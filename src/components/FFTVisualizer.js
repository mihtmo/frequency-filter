import { useContext, useEffect, useRef } from 'react';
import './FFTVisualizer.css';
import AudioContext from '../contexts/audioContext';
import * as d3 from "d3-scale";

const FFTVisualizer = ({ xScale, bandPassParams, chartDims, maxFreq }) => {
    const [audio] = useContext(AudioContext);
    const requestRef = useRef(null);
    const canvasRef = useRef(null);

    const audioVisualizerLogic = () => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        canvas.width = chartDims.width;
        canvas.height = chartDims.height;
        
        // Limit to human hearing
        const sampleRate = audio.ctx.sampleRate;
        const binCount = audio.analyser.frequencyBinCount;
        // Find number of frequencies each bin expresses
        const freqPerBin = ((sampleRate / 2) / binCount);
        // const maxBin = Math.ceil(maxFreq / freqPerBin);
        // const xScale = d3.scaleSymlog().domain([0, 24000]).range([0, chartDims.width]).constant(30);
        
        const paintCanvas = () => {
            const dataArray = new Float32Array(binCount);
            canvasCtx.clearRect(0, 0, chartDims.width, chartDims.height);
            requestRef.current = requestAnimationFrame(paintCanvas);
            audio.analyser.getFloatFrequencyData(dataArray);
            // console.warn(dataArray)
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = "black";
            canvasCtx.beginPath();
            canvasCtx.lineTo(0, chartDims.height);

            for (let i = 0; i < binCount; i++) {
                let freq = freqPerBin * i;
                let x = xScale(freq);
                let sliceHeight = (dataArray[i] + 140) * 2;
                canvasCtx.lineTo(x, chartDims.height - sliceHeight);
            }
            canvasCtx.lineTo(chartDims.width, chartDims.height);
            canvasCtx.stroke()
            canvasCtx.fillStyle = 'goldenrod'
            canvasCtx.fill();
        };
        paintCanvas();
    };

    // Run logic on mount (need canvasRef to be available )
    useEffect(() => {
        audioVisualizerLogic();
        return () => cancelAnimationFrame(requestRef.current);
    });

    return (
        <canvas className={'fft-canvas'} ref={canvasRef}/>
    )
}

export default FFTVisualizer