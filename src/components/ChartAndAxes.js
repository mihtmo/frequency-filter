import { useContext, useEffect, useRef, useState } from "react";
import { XAxis, YAxis } from "./Axes";
import './ChartAndAxes.css'
import BandOverlay from "./BandOverlay"
import FFTVisualizer from "./FFTVisualizer";
import AudioContext from "../contexts/audioContext";
import useWindowDimensions from "../hooks/useWindowDimensions";

const ChartAndAxes = () => {
    const [audio, setAudio, bandPassParams] = useContext(AudioContext);
    const [chartDims, setChartDims] = useState({})
    const chartRef = useRef(null);
    const {windowWidth, windowHeight} = useWindowDimensions();
    const [canvasCtx, setCanvasCtx] = useState(null);
    useEffect(() => {

    })

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
            <YAxis/>
            <div id='chart-wrapper' className='canvases'>
                <div className={'audio-chart'} ref={chartRef}>
                    { chartDims && (
                        <>
                            <FFTVisualizer
                                chartDims={chartDims} />
                            <BandOverlay
                                chartDims={chartDims}
                                bandPassParams={bandPassParams}/>
                        </>
                    ) }
                </div>
            </div>
            { chartDims.width && (
                <XAxis
                    chartDims={chartDims}
                    domain={[0, 20000]}
                    range={[0, chartDims.width]}/>
            )}
      </div>
    )
}

export default ChartAndAxes