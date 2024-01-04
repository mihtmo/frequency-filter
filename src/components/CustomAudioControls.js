import { useContext, useEffect, useRef, useState } from "react";
import PlayOrPauseIcon from "./icons/PlayOrPauseIcon"
import AudioContext from "../contexts/AudioContext";
import './CustomAudioControls.css'
import { secondsToTimestamp } from "../helpers/secondsToTimestamp";
import VariableVolumeIcon from "./icons/VariableVolumeIcon";

const CustomAudioControls = ({}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useContext(AudioContext);
    const requestRef = useRef(null);
    const timelineRef = useRef(null);
    const [volumeLevel, setVolumeLevel] = useState(.5);
    const [currentTime, setCurrentTime] = useState('loading...');

    function handlePlayPause() {
        if (audio.playerRef.current.paused) {
            audio.playerRef.current.play();
            setIsPlaying(true);
        } else {
            audio.playerRef.current.pause();
            setIsPlaying(false);
        }
        console.log(isPlaying)
        console.log(audio.playRef.current)
    }

    function handleProgressBar(e) {
        audio.playerRef.current.currentTime = e.target.value;
    }

    function startAudioAnimation() {
        const moveTimeline = () => {
            setTimeout(() => {
                requestRef.current = requestAnimationFrame(startAudioAnimation);
                timelineRef.current.value = audio.playerRef.current.currentTime;
                setCurrentTime((audio.playerRef.current.currentTime).toFixed(2));
            }, [1])
        }
        moveTimeline();
    };

    function handleVolumeChange(e) {
        setVolumeLevel(e.target.value);
    }

    useEffect(() => {
        if (audio.playerRef.current) {
            startAudioAnimation();
        }
        return (
            () => cancelAnimationFrame(requestRef.current)
        )
    }, [])

    useEffect(() => {
        if (audio.playerRef.current) {
            audio.playerRef.current.volume = volumeLevel
        }
    })

    const audioDuration = audio.playerRef.current.duration;

    return (
        <div id='controls-wrapper'>
            <PlayOrPauseIcon
                isPlaying={isPlaying}
                clickHandler={handlePlayPause}/>
            <input 
                id='audio-player-timeline'
                ref={timelineRef}
                type='range'
                min={0}
                max={audioDuration ? audioDuration : '...'}
                defaultValue={0}
                onChange={handleProgressBar}
                onInput={handleProgressBar}/>
            <div id='file-time-wrapper'>
                <span id='current-time-text'>{secondsToTimestamp(currentTime)}</span>
                /
                <span id='total-time-text'>{secondsToTimestamp(audio.playerRef.current.duration.toFixed(2))}</span>
            </div>
            <VariableVolumeIcon
                volume={volumeLevel}/>
            <input
                id='audio-player-volume'
                type='range'
                min={0}
                max={1}
                step='.01'
                defaultValue={.5}
                onChange={handleVolumeChange}
                onInput={handleVolumeChange}/>
        </div>
    )
}

export default CustomAudioControls;