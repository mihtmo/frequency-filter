import { useContext, useEffect, useRef } from 'react';
import './FFTVisualizer.css';
import AudioContext from '../contexts/audioContext';

const FFTVisualizer = ({ chartDims }) => {
    const [audio] = useContext(AudioContext);
    const requestRef = useRef(null);
    const canvasRef = useRef(null);

    const audioVisualizerLogic = () => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        canvas.width = chartDims.width;
        canvas.height = chartDims.height;
        const paintCanvas = () => {
            // Limit to human hearing
            const maxFreq = 20000
            const sampleRate = audio.ctx.sampleRate;
            const binCount = audio.analyser.frequencyBinCount;
            const binWidthFreq = ((sampleRate / 2) / binCount);
            const maxBin = Math.ceil(maxFreq / binWidthFreq);
            const dataArray = new Float32Array(maxBin);

            let barHeight = null
            // console.warn(dataArray)
            canvasCtx.clearRect(0, 0, chartDims.width, chartDims.height);
            // setTimeout(() => {
            requestRef.current = requestAnimationFrame(paintCanvas);
            // });
            // requestAnimationFrame(paintCanvas);

            console.log(maxBin)
            audio.analyser.getFloatFrequencyData(dataArray);
            // console.log(canvas.clientHeight, (canvas.clientHeight - dataArray[0]));
            // console.log(dataArray[0]);
            let x = 0;
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = "rgb(0, 0, 0)";
            canvasCtx.beginPath();
            canvasCtx.lineTo(0, chartDims.height);
            // canvasCtx.stroke();


            for (let i = 0; i < maxBin; i++) {
                //color based upon frequency
                // Can use D3 for this as well!
                x = (Math.log(i) / Math.log(maxBin)) * chartDims.width
                const sliceWidth = ((Math.log(i + 1) / Math.log(maxBin) * chartDims.width) - x) - 1;
                const sliceHeight = (dataArray[i] + 140) * 2;
                if (i !== 0) {
                  canvasCtx.lineTo(x, chartDims.height - sliceHeight);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(chartDims.width, chartDims.height);
            canvasCtx.fillStyle = 'grey'
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