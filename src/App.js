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
import PowerIcon from './components/icons/PowerIcon';
import CustomDetails from './components/CustomDetails';
import { BeetleIcon } from './components/icons/SoundSourceIcons';

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
                <p> 
                    Sound Explorer was created as a way to look into what 
                    lies at the intersection of audio engineering and 
                    ecology. 
                </p>
                <CustomDetails
                    openSummary='Read Less'
                    closedSummary='Read More'
                    iconOrientation='both'
                    body={
                        <>
                        <p> 
                            Spend enough time in your backyard listening to the
                            birds, frogs, crickets, trees, neighbors, and cars with
                            which you share your space, and you'll inevitably begin
                            dipping your toes into a field of study called 
                            <a target='_blank' href='https://en.wikipedia.org/wiki/Soundscape_ecology'> soundscape ecology</a>.
                            In short, soundscape ecology is the study of how
                            organisms—humans most certainly included—interact with
                            each other and with their shared environment on an
                            acoustic level. Over time, many animals have evolved to
                            sing within a specific range of frequencies, allowing
                            them to communicate with their own species amidst the
                            calls of other members of their community. This allows
                            them to herald danger, find mates, say hello, understand
                            their surroundings, and perform many other vital
                            functions.
                        </p>
                        <p>
                            It's often difficult for us as humans to appreciate the
                            breadth of natural sounds in our environments, either 
                            because of a focus on audio-based entertainment (podcasts, 
                            music, conversation, you name it), the massive
                            amount of noise pollution that exists in many of our
                            environments (cars, AC units, construction, etc.), or
                            simply as a result of our natural biological limitations 
                            (there are a variety of animals who produce sound above 
                            and below our natural hearing range).
                        </p>
                        <p>
                            This tool is designed to cut through some of that noise
                            and to provide an example of how species frequently 
                            occupy somewhat discrete portions of the audio spectrum. 
                            At its heart, Sound Explorer uses what's called a 
                            band-pass filter. This kind of filter allows you to 
                            listen to a specific range of frequencies within an 
                            audio file while silencing others. Try activating the 
                            filter by pressing the power icon or by selecting a
                            preset in the menu on the right-hand side of the chart!
                        </p>
                        <p>
                            The current demo uses a selection of recordings taken in
                            Austin, TX. Try listening to the audio file without the
                            filter activated and see how many different sounds you
                            notice. Then try selecting preset ranges in the side
                            menu to isolate individual species! Notice how, when you
                            return to the unfiltered audio, it's easier to pluck out
                            the animal you just isolated. Also notice how wide of a
                            range the "Road Noise" preset occupies—us humans have
                            been getting louder and louder over time, and our
                            indiscriminate occupation of our soundscapes is a real
                            ecological threat to many species.
                        </p>
                        <p>
                            This is the first version of this tool! There will be
                            updates to come, which will include additional audio 
                            files as well as the ability to upload your own audio 
                            files to use within the tool.
                        </p>
                        <p>
                            Thanks for exploring! (January 2024)
                        </p>
                        </>
                    }
                    customOpenIcon={<BeetleIcon/>}
                    customClosedIcon={<BeetleIcon/>}
                    />
        </div>
    );
    }

export default App;
