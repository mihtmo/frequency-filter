import sample from './audio/crickets-and-cars2.wav'
// import sample from './audio/sample.wav'
import './App.css';
import {createRef, useEffect, useRef, useState} from 'react';
import ChartAndAxes from './components/ChartAndAxes';
import { AudioProvider } from './contexts/AudioContext';
import LightOrDarkIcon from './components/LightOrDarkIcon';
import PlayOrPauseIcon from './components/PlayOrPauseIcon';
import CustomAudioControls from './components/CustomAudioControls';

function App() {
    const [audio, setAudio] = useState({});
    // Check theme of browser
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const audioPlayerRef = useRef();
    const analyserRef = useRef();
    const audioSourceRef = useRef();
    const bandCount = 8;
    const bandRefs = useRef([]);
    const gainRef = useRef([]);

    useEffect(() => {
        // Audio source is <audio> component in App.js
        const ctx = new AudioContext();
        audioSourceRef.current = ctx.createMediaElementSource(audioPlayerRef.current);
        for (let i=0; i<bandCount; i++) {
            bandRefs.current[i] = ctx.createBiquadFilter();
            bandRefs.current[i].type = 'allpass';
            bandRefs.current[i].frequency.value = 1000;
            bandRefs.current[i].Q.value = 1;
        }
        analyserRef.current = ctx.createAnalyser();
        // audioSourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 4096;
        // Connect first band
        // console.warn(bandRefs)
        gainRef.current = ctx.createGain();
        audioSourceRef.current.connect(bandRefs.current[0]);
        // Connect subsequent bands to each other
        for (let i=0; i<bandCount-1; i++) {
            bandRefs.current[i].connect(bandRefs.current[i+1]);
        };
        // Connect final band to analyser
        bandRefs.current[bandCount-1].connect(analyserRef.current);
        // Connect analyser to destination
        analyserRef.current.connect(ctx.destination);
        setAudio({
            ...audio,
            'playerRef': audioPlayerRef,
            'ctx': ctx,
            'analyser': analyserRef.current,
            'bandRefs': bandRefs
        });
    }, [])

    function handleThemeChange() {
        setIsDarkTheme(!isDarkTheme)
    }

    return (
        <div className='App' data-theme={isDarkTheme?'dark':'light'}>
            <LightOrDarkIcon
                isDarkTheme={isDarkTheme}
                clickHandler={handleThemeChange}/>
            <header className='App-header'>
                <div className='title'>
                    <h1> Sound Explorer </h1>
                </div>
                { analyserRef.current && 
                    <AudioProvider value={[audio, setAudio]}>
                        <ChartAndAxes/>
                        <CustomAudioControls/>
                    </AudioProvider>
                    }
                <audio id='audio-player' ref={audioPlayerRef} controls loop>
                    <source src={sample} type='audio/wav'/>
                    Your browser does not support the audio element.
                </audio>
            </header>
        </div>
    );
    }

export default App;
