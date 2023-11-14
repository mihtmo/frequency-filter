import { useContext, useEffect, useRef, useState } from "react";
import { XAxis, YAxis } from "./Axes";
import './ChartAndAxes.css'
import BandOverlay from "./BandOverlay"
import FFTVisualizer from "./FFTVisualizer";
import AudioContext from "../contexts/audioContext";
import useWindowDimensions from "../hooks/useWindowDimensions";
import * as d3 from "d3-scale";

const ChartAndAxes = () => {
    const [audio, setAudio, bandPassParams] = useContext(AudioContext);
    const [chartDims, setChartDims] = useState({})
    const chartRef = useRef(null);
    const {windowWidth, windowHeight} = useWindowDimensions();
    const [canvasCtx, setCanvasCtx] = useState(null);

    const xDomain = [0, 24000];
    const xRange = [0, chartDims.width];
    const maxFreq = 20000;
    const xValues = [0, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    const xScale = d3.scaleSymlog().domain(xDomain).range(xRange).constant(30);
    
    const yDomain = [-12, 12];
    const yRange = [0, chartDims.height];
    const yScale = d3.scaleLinear().domain([yDomain[1], yDomain[0]]).range(yRange);

    useEffect(() => {
        const chart = chartRef.current
        const chartRect = chart.getBoundingClientRect();
        setChartDims({
            'width': chartRect.width,
            'height': chartRect.height,
            'left': chartRect.left,
            'top': chartRect.top
        })
    }, [windowWidth, windowHeight]);

    return (
        <div className='chart-and-axes'>
            <YAxis
                domain={yDomain}
                range={yRange}
                scale={yScale}/>
            <div id='chart-wrapper' className='canvases'>
                <div className={'audio-chart'} ref={chartRef}>
                    { chartDims && (
                        <>
                            <FFTVisualizer
                                chartDims={chartDims} 
                                maxFreq={maxFreq}
                                bandPassParams={bandPassParams}
                                xScale={xScale}/>
                            <BandOverlay
                                xScale={xScale}
                                chartDims={chartDims}
                                bandPassParams={bandPassParams}/>
                        </>
                    ) }
                </div>
            </div>
            <XAxis
                values={xValues}
                domain={xDomain}
                range={xRange}
                scale={xScale}/>
      </div>
    )
}

export default ChartAndAxes