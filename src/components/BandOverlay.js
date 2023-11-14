import { useContext, useEffect, useRef, useState } from 'react';
import AudioContext from '../contexts/audioContext';
import './BandOverlay.css';


const BandOverlay = ({ xScale, chartDims }) => {
    // Set band center in pixels
    const [audio, setAudio, bandPassParams, setBandPassParams] = useContext(AudioContext);
    const [bandCenter, setBandCenter] = useState(null);
    const [bandWidth, setBandWidth] = useState(100);
    const canvasRef = useRef(null);

    let canvas = canvasRef.current;
    
    useEffect(() => {
        canvas = canvasRef.current;
        canvas.width = chartDims.width;
        canvas.height = chartDims.height;
    })

    function handleMouseDown(e) {
        let mouseCoords = [e.clientX, e.clientY]
        let canvasCoords = [mouseCoords[0] - chartDims.left, mouseCoords[1] - chartDims.top];
        setBandCenter(canvasCoords[0]);
        function handleDrag(e) {
            mouseCoords = [e.clientX, e.clientY];
            canvasCoords = [mouseCoords[0] - chartDims.left, mouseCoords[1] - chartDims.top];
            setBandCenter(Math.min(Math.max(canvasCoords[0], bandWidth / 2), chartDims.width - (bandWidth / 2)));
        }
        function endDrag() {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', endDrag);
        }
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', endDrag);
    }

    function handleMouseOver(e) {
        const canvasCtx = canvas.getContext('2d');
        let mouseCoords = [e.clientX, e.clientY];
        let canvasCoords = [mouseCoords[0] - chartDims.left, mouseCoords[1] - chartDims.top];
        if (canvasCoords[0] > bandCenter - (bandWidth / 2) &&
                            canvasCoords[1] < bandCenter + (bandWidth / 2)) {
            canvasCtx.fillStyle = 'black'
            canvasCtx.lineWidth = 2
            canvasCtx.beginPath();
            canvasCtx.arc(bandCenter, chartDims.height / 2, 5, 0, 2 * Math.PI);
            canvasCtx.fill();
        }
    }

    useEffect(() => {
        const canvasCtx = canvas.getContext('2d');
        const gradient1 = canvasCtx.createLinearGradient(bandCenter - (bandWidth / 2), 0, bandCenter, 0)
        gradient1.addColorStop(0, 'rgba(252,192,6, .4)');
        gradient1.addColorStop(.3, 'rgba(252,192,6, .8)');
        gradient1.addColorStop(1, 'rgba(252,192,6, 1)');
        const gradient2 = canvasCtx.createLinearGradient(bandCenter, 0, bandCenter + (bandWidth / 2), 0)
        gradient2.addColorStop(0, 'rgba(252,192,6, 1)');
        gradient2.addColorStop(.7, 'rgba(252,192,6, .8)');
        gradient2.addColorStop(1, 'rgba(252,192,6, .4)');
        canvasCtx.fillStyle = gradient1;
        canvasCtx.fillRect(bandCenter - (bandWidth / 2), 0, bandWidth / 2, chartDims.height);
        canvasCtx.fillStyle = gradient2;
        canvasCtx.fillRect(bandCenter, 0, bandWidth / 2, chartDims.height)
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "white";
        canvasCtx.beginPath();
        canvasCtx.lineTo(bandCenter, 0);
        canvasCtx.lineTo(bandCenter, chartDims.height);
        canvasCtx.stroke();
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.lineTo(bandCenter + bandWidth / 2, 0);
        canvasCtx.lineTo(bandCenter + bandWidth / 2, chartDims.height);
        canvasCtx.stroke();
        canvasCtx.beginPath();
        canvasCtx.lineTo(bandCenter - bandWidth / 2, 0);
        canvasCtx.lineTo(bandCenter - bandWidth / 2, chartDims.height);
        canvasCtx.stroke();
        if (bandCenter) {
            audio.band1.frequency.value = xScale.invert(bandCenter);
        }

    }, [bandCenter, bandWidth])


    return (
        <canvas onMouseMove={handleMouseOver} onMouseDown={handleMouseDown} className={'band-overlay-canvas'} ref={canvasRef} />
    )
}

export default BandOverlay;