import sample from './audio/nature-audio-combo.mp3'
// import sample from './audio/sample.wav'
import './App.css';
import {useEffect, useRef, useState} from 'react';
import ChartAndAxes from './components/ChartAndAxes';
import { AudioProvider } from './contexts/AudioContext';
import LightOrDarkIcon from './components/icons/LightOrDarkIcon';
import CustomAudioControls from './components/CustomAudioControls';
import RotateIcon from './components/icons/RotateIcon';
import isMobileBrowser from './helpers/isMobileBrowser';

function App() {
    const [isLandscapeMode, setIsLandscapeMode] = useState(
        !window.matchMedia("(orientation: portrait)").matches
    );
    const [audio, setAudio] = useState({});
    // Check theme of browser
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const audioPlayerRef = useRef();
    const analyserRef = useRef();
    const audioSourceRef = useRef();
    const bandCount = 10;
    const bandRefs = useRef([]);
    const gainRef = useRef([]);
    const [mobileUser, setMobileUser] = useState(isMobileBrowser());

    // Watch for orientation change, set state respectively
    useEffect(() => {
        function handleOrientationChange(e) {
            const landscape = e.matches;
            setIsLandscapeMode(landscape);
        }
        window.matchMedia("(orientation: landscape)").addEventListener(
                                            "change", handleOrientationChange);
        // Cleanup event listener
        return window.matchMedia("(orientation: landscape)").removeEventListener(
                                            "change", handleOrientationChange);
    }, [])

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
        analyserRef.current.fftSize = 4096;
        // Connect first band
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

    // Change theme (todo: this could be smarter)
    function handleThemeChange() {
        setIsDarkTheme(!isDarkTheme)
    }

    // Set overall body-element background-color based on CSS variable
    // This is done to prevent different background on scroll
    useEffect(() => {
        const backgroundColor = window.getComputedStyle(document.querySelector('.theme-wrapper')).getPropertyValue('--container-back');
        document.body.style.backgroundColor = backgroundColor;
    }, [isDarkTheme])

    return (
        <div className='theme-wrapper' data-theme={isDarkTheme?'dark':'light'}>
                { (mobileUser && !isLandscapeMode) && (
                    <div id='portrait-overlay'> 
                        <div id='overlay-text-wrapper'>
                            <div> this app was designed for landscape mode </div>
                            <RotateIcon/>
                            <div> please rotate your device </div>
                        </div>
                    </div>
                )}
                <header className='page-header'>
                    <div className='title'>
                        <h1> Sound Explorer </h1>
                    </div>
                    { (analyserRef.current && audio.playerRef.current) && (
                        <AudioProvider value={[audio, setAudio]}>
                            <ChartAndAxes/>
                            <CustomAudioControls/>
                        </AudioProvider>
                    ) }
                    <audio id='audio-player' preload='auto' ref={audioPlayerRef} loop>
                        <source src={sample} type='audio/mpeg'/>
                        Your browser does not support the audio element.
                    </audio>
                </header>
                <LightOrDarkIcon
                    isDarkTheme={isDarkTheme}
                    clickHandler={handleThemeChange}/>
        </div>
    );
    }

export default App;
