// Component which returns one of three volume icons indicating 
// volume based on 0-100 prop value.

const VariableVolumeIcon = ({ volume }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" 
            className="feather feather-volume">
                {(volume == 0) && 
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                }
                {(volume > 0 && volume <= .5) && (
                    <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </>
                )}
                {(volume > .5 && volume <= 1) && (
                    <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </>
                )}
        </svg>
    )
}

export default VariableVolumeIcon;
