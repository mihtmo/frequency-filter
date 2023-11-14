// import sample from './audio/crickets-and-cars.wav'
import sample from './audio/sample.wav'
import './App.css';
import {useEffect, useRef, useState} from 'react';
import SliderWithInput from './components/SliderWithInput';
import useWindowDimensions from './hooks/useWindowDimensions';
import ChartAndAxes from './components/ChartAndAxes';
import { AudioProvider } from './contexts/audioContext';

function App() {
  const [audio, setAudio] = useState({});
  // Used to trigger rerenders and changes for overlay display
  const [bandPassParams, setBandPassParams] = useState({
    frequency: null,
    Q: null,
    active: true
  })
  const audioPlayerRef = useRef();
  const analyserRef = useRef();
  const audioSourceRef = useRef();
  const bandCount = 4
  const bandRefs = useRef()
  const band1Ref = useRef();
  const band2Ref = useRef();
  const band3Ref = useRef();
  const band4Ref = useRef();
  const band5Ref = useRef();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    // Audio source is <audio> component in App.js
    const ctx = new AudioContext();
    audioSourceRef.current = ctx.createMediaElementSource(audioPlayerRef.current);
    band1Ref.current = ctx.createBiquadFilter();
    band1Ref.current.type = 'bandpass';
    band1Ref.current.frequency.value = 2750;
    band1Ref.current.Q.value = 10;
    band2Ref.current = ctx.createBiquadFilter();
    band2Ref.current.type = 'bandpass';
    band2Ref.current.frequency.value = 2750;
    band2Ref.current.Q.value = 10;
    band3Ref.current = ctx.createBiquadFilter();
    band3Ref.current.type = 'bandpass';
    band3Ref.current.frequency.value = 2750;
    band3Ref.current.Q.value = 10;
    band4Ref.current = ctx.createBiquadFilter();
    band4Ref.current.type = 'bandpass';
    band4Ref.current.frequency.value = 2750;
    band4Ref.current.Q.value = 10;
    analyserRef.current = ctx.createAnalyser();
    // audioSourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 4096;
    audioSourceRef.current.connect(band1Ref.current);
    band1Ref.current.connect(band2Ref.current);
    band2Ref.current.connect(band3Ref.current);
    band3Ref.current.connect(band4Ref.current);
    band4Ref.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);
    setAudio({
      ...audio,
      'ctx': ctx,
      'analyser': analyserRef.current,
      'band1': band1Ref.current
    });
  }, [])

  

  // Q = centerFrequency / (top_freq - bottom_freq)

  function handleBandParamChange(value, paramName) {
    if (band1Ref.current.type === 'allpass') {
      band1Ref.current.type = 'bandpass'
      band2Ref.current.type = 'bandpass'
      band3Ref.current.type = 'bandpass'
    }
    band1Ref.current[paramName]['value'] = value;
    band2Ref.current[paramName]['value'] = value;
    band3Ref.current[paramName]['value'] = value;
    band4Ref.current[paramName]['value'] = value;
    setBandPassParams({
      ...bandPassParams,
      [paramName]: value
    })
    setToggle(toggle ? false : true);
  }

  const chartDims = {
    
  }

  console.warn(bandPassParams)

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='title'>
          {/* <h3>Outdoor Orchestra</h3> */}
        </div>
        { analyserRef.current && 
          <AudioProvider value={[audio, setAudio, bandPassParams, setBandPassParams]}>
            <ChartAndAxes/>
          </AudioProvider>
        }
        {/* <canvas className='eq-controls-overlay'>
        </canvas> */}
        <audio ref={audioPlayerRef} controls loop>
          <source src={sample} type='audio/wav'/>
          Your browser does not support the audio element.
        </audio>
        <SliderWithInput
          label='Frequency'
          min='1'
          max='24000'
          defaultVal='2750'
          step='1'
          paramName='frequency'
          changeHandler={handleBandParamChange}/>
        <SliderWithInput
          label='Q'
          min='0'
          max='1000'
          defaultVal='.001'
          step='.1'
          paramName='Q'
          changeHandler={handleBandParamChange}/>
        {/* <button onClick={createFilter}> Create Filter </button> */}
      </header>
    </div>
  );
}

export default App;
