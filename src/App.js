import sample from './audio/crickets-and-cars.wav'
// import sample from './audio/sample.wav'
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
  const band1Ref = useRef();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    // Audio source is <audio> component in App.js
    const ctx = new AudioContext();
    audioSourceRef.current = ctx.createMediaElementSource(audioPlayerRef.current);
    band1Ref.current = ctx.createBiquadFilter();
    band1Ref.current.type = 'allpass';
    band1Ref.current.frequency.value = 2750;
    band1Ref.current.Q.value = 1;
    analyserRef.current = ctx.createAnalyser();
    // audioSourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;
    audioSourceRef.current.connect(band1Ref.current);
    band1Ref.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);
    setAudio({
      ...audio,
      'ctx': ctx,
      'analyser': analyserRef.current,
    });
  }, [])

  function handleBandParamChange(value, paramName) {
    if (band1Ref.current.type === 'allpass') {
      band1Ref.current.type = 'bandpass'
    }
    band1Ref.current[paramName]['value'] = value;
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
          <AudioProvider value={[audio, setAudio, bandPassParams]}>
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
          max='20000'
          defaultVal='2750'
          step='1'
          paramName='frequency'
          changeHandler={handleBandParamChange}/>
        <SliderWithInput
          label='Q'
          min='0'
          max='10'
          defaultVal='1'
          step='.1'
          paramName='Q'
          changeHandler={handleBandParamChange}/>
        {/* <button onClick={createFilter}> Create Filter </button> */}
      </header>
    </div>
  );
}

export default App;
