import { useState } from "react";
import "./SliderWithInput.css"

const SliderWithInput = ({ label, defaultVal, min, max, step, paramName, changeHandler }) => {
    const [sliderVal, setSliderVal] = useState(defaultVal);

    function handleChange(e) {
        setSliderVal(e.target.value);
        changeHandler(e.target.value, paramName);
    }

    return (
        <div className='slider-and-labels-wrapper'>
            <label> {label} </label>
            <input
                type='range' 
                min={min}
                max={max} 
                step={step}
                defaultValue={defaultVal}
                onChange={handleChange}
            />
            <input
                type='number'
                value={sliderVal}
                onChange={handleChange}/>
        </div>
    )
}

export default SliderWithInput;