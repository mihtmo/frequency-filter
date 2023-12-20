// Custom hook for watching div dimensions (returns dict with width and height)

import { useEffect, useState } from "react";

const useDivDimensions = (ref) => {

    useEffect(() => {
        function handleResize() {};
        ref.current.addEventListener('resize', handleResize);
        return () => { ref.current.removeEventListener('resize', handleResize) };
    }, [])

    return false;
}

export default useDivDimensions;