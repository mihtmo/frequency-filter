import { useContext, useState } from "react";
import PlayOrPauseIcon from "./PlayOrPauseIcon"
import AudioContext from "../contexts/AudioContext";
import './CustomAudioControls.css'

const CustomAudioControls = ({}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useContext(AudioContext);

    function handlePlayPause() {
        if (audio.playerRef.current.paused) {
            audio.playerRef.current.play();
            setIsPlaying(true);
        } else {
            audio.playerRef.current.pause();
            setIsPlaying(false);
        }
    }

    function handleProgressBar(e) {
        audio.playerRef.current.currentTime = e.target.value;
    }

    return (
        <div id='controls-wrapper'>
            <PlayOrPauseIcon
                isPlaying={isPlaying}
                clickHandler={handlePlayPause}/>
            <input 
                type='range'
                min={0}
                max={audio.playerRef.current.duration + 1}
                defaultValue={0}
                onChange={handleProgressBar}/>
        </div>
    )
}

export default CustomAudioControls;