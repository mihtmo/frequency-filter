import './PlayOrPauseIcon.css'

const PlayOrPauseIcon = ({ isPlaying, clickHandler }) => {
    
    function handleIconClick() {
        clickHandler();
    }

    return (
        <div id='play-button-wrapper' onClick={handleIconClick}>
            { isPlaying ? (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="feather feather-pause">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            ) : (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="feather feather-play">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
            ) }
        </div>
    )
}

export default PlayOrPauseIcon;