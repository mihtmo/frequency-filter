import { useContext, useEffect, useRef, useState } from "react";
import { XAxis, YAxis } from "./Axes";
import './ChartAndAxes.css'
import BandOverlay from "./BandOverlay"
import FFTVisualizer from "./FFTVisualizer";
import AudioContext from "../contexts/AudioContext";
import useWindowDimensions from "../hooks/useWindowDimensions";
import * as d3 from "d3-scale";
import PresetMenu from "./PresetMenu";
import useDivDimensions from "../hooks/useDivDimensions";
import BandContext, { BandContextProvider } from "../contexts/BandContext";

const ChartAndAxes = () => {
    const [audio, setAudio] = useContext(AudioContext);
    const [chartDims, setChartDims] = useState({})
    const chartRef = useRef(null);
    const {windowWidth, windowHeight} = useWindowDimensions();
    const [canvasCtx, setCanvasCtx] = useState(null);
    // Get default values from bandRef info
    const bandRef = audio.bandRefs.current[0];
    const defaultWidthFreq = bandRef.frequency.value / bandRef.Q.value;
    const defaultCenterFreq = bandRef.frequency.value;
    const defaultLowFreq = defaultCenterFreq - defaultWidthFreq/2;
    const defaultHighFreq = defaultCenterFreq + defaultWidthFreq/2;
    const [bandParams, setBandParams] = useState({
        lowFreq: defaultLowFreq,
        highFreq: defaultHighFreq,
        centerFreq: defaultCenterFreq
    });
    const [bandActive, setBandActive] = useState(false);
    const xDomain = [0, 24000];
    const xRange = [0, chartDims.width];
    const xValues = [0, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    const xScale = d3.scaleSymlog().domain(xDomain).range(xRange).constant(30);
    
    const yDomain = [-130, 0];
    const yRange = [0, chartDims.height];
    const yScale = d3.scaleLinear().domain([yDomain[1], yDomain[0]]).range(yRange);

    useEffect(() => {
        if (chartRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                const chart = chartRef.current;
                const chartRect = chart.getBoundingClientRect();
                setChartDims({
                    'width': chartRect.width,
                    'height': chartRect.height,
                    'left': chartRect.left,
                    'top': chartRect.top
                })
            })
            resizeObserver.observe(chartRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => {
        const chart = chartRef.current;
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
            { chartDims.height && 
                <YAxis
                    domain={yDomain}
                    range={yRange}
                    scale={yScale}/>
            }
            <BandContextProvider value={[bandParams, setBandParams, bandActive, setBandActive]}>
                <div id='charts-and-menu-wrapper' className='canvases'>
                    <div className='audio-charts' ref={chartRef}>
                        { chartDims.height && (
                            <>
                                <FFTVisualizer
                                    chartDims={chartDims} 
                                    xScale={xScale}
                                    yScale={yScale}/>
                                <BandOverlay
                                    xScale={xScale}
                                    chartDims={chartDims}/>
                            </>
                        ) }
                    </div>
                    <PresetMenu/>
                </div>
            </BandContextProvider>
            {chartDims.width &&
                <XAxis
                    values={xValues}
                    domain={xDomain}
                    range={xRange}
                    scale={xScale}/>
            }
      </div>
    )
}

export default ChartAndAxes