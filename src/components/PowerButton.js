// Open-source SVG Component of Power Button symbol from feathericons

const PowerButton = ({ x, y, radius, color, onClick }) => {
    return (
        <svg
            className='power-button'
            xmlns='http://www.w3.org/2000/svg' 
            x={x}
            y={y}
            width={radius} 
            height={radius} 
            viewBox='0 0 24 24' 
            fill='none' 
            stroke={color}
            strokeWidth='2' 
            strokeLinecap='round' 
            strokeLinejoin='round' 
            onClick={onClick}
        >
            <path d='M18.36 6.64a9 9 0 1 1-12.73 0'/>
            <line x1='12' y1='2' x2='12' y2='12'/>
            <rect 
                className='power-button-box'
                stroke='none' 
                fill='transparent' 
                width={radius + 6.64} 
                height={radius + 6.64}/>
        </svg>
    )
}

export default PowerButton;
