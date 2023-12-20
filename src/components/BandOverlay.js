import { useContext, useEffect, useRef, useState } from 'react';
import AudioContext from '../contexts/AudioContext';
import './BandOverlay.css';
import PowerIcon from './icons/PowerIcon';
import BandContext from '../contexts/BandContext';

// NOTE:
// YOU CAN ONLY USE THE xSCALE TO FIND POINTS, NOT RANGES

const BandOverlay = ({ xScale, chartDims }) => {
    // Set band center in pixels
    const [audio, setAudio] = useContext(AudioContext);
    const chartRef = useRef(null);
    const [bandParams, setBandParams, bandActive, setBandActive] = useContext(BandContext);
    const [bandDims, setBandDims] = useState({
        left: xScale(bandParams.lowFreq),
        right: xScale(bandParams.highFreq),
        width: xScale(bandParams.highFreq) - xScale(bandParams.lowFreq),
        center: xScale(bandParams.centerFreq)
    });

    const [bandOpacity, setBandOpacity] = useState(10);
    // const [bandActive, setBandActive] = useState(false);

    const mainColor = bandActive ? 'goldenrod' : 'grey';

    // useEffect(() => {
    //     setBandDims({
    //         left: xScale(bandParams.left),
    //     })
    // }, [chartDims])

    function handleMouseDown(e) {
        // Get coords for mouse on page
        const startMouseCoords = [e.clientX, e.clientY]

        // Get id for selected element
        const target = e.target.id;

        function handleDrag(e) {
            const currMouseCoords = [e.clientX, e.clientY];
            const currChartCoords = [currMouseCoords[0] - chartDims.left, currMouseCoords[1] - chartDims.top];
            let newWidth = null;
            // Perform drag actions based on selected element
            let newLeftPix = null;
            let newWidthPix = null;
            switch (target) {
                // When dragging band (not edge)
                case 'band':
                    const xChangePix = currMouseCoords[0] - startMouseCoords[0];
                    // Get new left edge value in pixels
                    newLeftPix = Math.min(
                        Math.max(bandDims.left + xChangePix, 0),
                        chartDims.width - (bandDims.width)
                    );
                    // Convert to hertz and set new values
                    setBandParams({
                       lowFreq: xScale.invert(newLeftPix),
                       highFreq: xScale.invert(newLeftPix + bandDims.width),
                       centerFreq: xScale.invert(newLeftPix + bandDims.width/2)
                    });
                    break;
                case 'band-edge-left':
                case 'band-edge-line-left':
                    newLeftPix = Math.max(
                        Math.min(currChartCoords[0], bandDims.right - 50),
                        0
                    );
                    newWidthPix = bandDims.right - newLeftPix;
                    let newCenterPix = newLeftPix + newWidthPix/2;
                    setBandParams({
                        ...bandParams,
                        lowFreq: xScale.invert(newLeftPix),
                        centerFreq: xScale.invert(newCenterPix)
                    });
                    break;
                case 'band-edge-right':
                case 'band-edge-line-right':
                    const newRightPix = Math.min(
                        Math.max(currChartCoords[0], bandDims.left + 50),
                        chartDims.width
                    );
                    newWidthPix = newRightPix - bandDims.left;
                    setBandParams({
                        ...bandParams,
                        highFreq: xScale.invert(newRightPix),
                        centerFreq: xScale.invert(bandDims.left + newWidthPix/2)
                    });
                    break;
            }
        }
        function endDrag() {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', endDrag);
        }
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', endDrag);
    }

    function updateBandRefs() {
        const lowFrequency = bandParams.lowFreq;
        const highFrequency = bandParams.highFreq;
        const centerFrequency = bandParams.centerFreq;
        const targetQ = centerFrequency / (highFrequency - lowFrequency);
        if (bandParams.centerFreq) {
            audio.bandRefs.current.forEach((ref) => {
                ref.frequency.value = centerFrequency
                ref.Q.value = targetQ
            })
        }
    }

    // Convert band parameters into chart units (pixels)
    // Set pixel units in bandDims state for positioning visuals
    useEffect(() => {
        const leftPix = xScale(bandParams.lowFreq);
        const rightPix = xScale(bandParams.highFreq);
        const widthPix = rightPix - leftPix;
        setBandDims({
            left: leftPix,
            right: rightPix,
            width: widthPix,
            center: leftPix + widthPix/2
        })
        // If bandParams change, update bandRefs to reflect
        updateBandRefs();
    }, [bandParams, chartDims])

    function handlePowerButton() {
        setBandActive(!bandActive);
    }

    function handleBandStateChange() {
        if (bandActive) {
            audio.bandRefs.current.forEach((ref) => {
                ref.type = 'bandpass'
            })
        } else {
            audio.bandRefs.current.forEach((ref) => {
                ref.type = 'allpass'
            })
        }
    }

    useEffect(() => {
        handleBandStateChange();
    }, [bandActive])

    return (
        <div 
            // onMouseMove={handleMouseOver} 
            onMouseDown={handleMouseDown} 
            id={'band-overlay-chart'} 
            ref={chartRef}
        >
            <svg width={chartDims.width} height={chartDims.height}>
                <linearGradient id='band-gradient' x1='0' x2='0' y1='0' y2='1'>
                    <stop offset='0%' stopColor={mainColor} stopOpacity='1'/>
                    <stop offset='1%' stopColor={mainColor} stopOpacity='70'/>
                    <stop offset='35%' stopColor={mainColor} stopOpacity='80'/>
                    <stop offset='50%' stopColor={mainColor} stopOpacity='80'/>
                    <stop offset='65%' stopColor={mainColor} stopOpacity='80'/>
                    <stop offset='99%' stopColor={mainColor} stopOpacity='70'/>
                    <stop offset='100%' stopColor={mainColor} stopOpacity='1'/>
                </linearGradient>
                <rect 
                    id='band'
                    x={bandDims.left} 
                    width={bandDims.width} 
                    height={chartDims.height} 
                    fill={"url(#band-gradient)"}
                    opacity={bandOpacity}>
                </rect>
                <rect 
                    id='band-edge-left' 
                    className='band-edge' 
                    x={bandDims.left - 13} 
                    width={26} 
                    height={chartDims.height}
                    onMouseDown={handleMouseDown}/>
                <rect 
                    id='band-edge-right'
                    className='band-edge' 
                    x={bandDims.left + bandDims.width - 13} 
                    width={26} 
                    height={chartDims.height}
                    onMouseDown={handleMouseDown}/>
                <line
                    id='band-edge-line-left'
                    className='band-edge-line'
                    x1={bandDims.left}
                    x2={bandDims.left}
                    y1={0}
                    y2={chartDims.height}
                    strokeWidth={1}
                    stroke={mainColor}/>
                <line
                    id='band-edge-line-right'
                    className='band-edge-line'
                    x1={bandDims.left + bandDims.width}
                    x2={bandDims.left + bandDims.width}
                    y1={0}
                    y2={chartDims.height}
                    strokeWidth={1}
                    stroke={mainColor}/>
                <line
                    id='band-edge-handle-left'
                    className='band-edge-handle'
                    x1={bandDims.left + 6}
                    x2={bandDims.left + 6}
                    y1={chartDims.height/2 - 6}
                    y2={chartDims.height/2 + 6}
                    strokeWidth={1}
                    stroke={mainColor}/>
                <line
                    id='band-edge-handle-right'
                    className='band-edge-handle'
                    x1={bandDims.left + bandDims.width - 6}
                    x2={bandDims.left + bandDims.width - 6}
                    y1={chartDims.height/2 - 6}
                    y2={chartDims.height/2 + 6}
                    strokeWidth={1}
                    stroke={mainColor}/>
                <PowerIcon
                    x={bandDims.left + bandDims.width - 24} 
                    y={chartDims.height - 24} 
                    radius={18} 
                    color={mainColor}
                    onClick={handlePowerButton}/>
            </svg>
        </div>

    )
}

export default BandOverlay;