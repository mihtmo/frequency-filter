// Custom hook for using window dimensions (returns dict with width and height)

import { useEffect, useState } from "react";

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                windowHeight: window.innerHeight, 
                windowWidth: window.innerWidth })
        };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) };
    }, [])

    return windowDimensions;
}

export default useWindowDimensions;