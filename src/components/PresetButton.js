import './PresetButton.css'
import { BeetleIcon, BirdIcon, CarIcon, FrogIcon, OwlIcon } from './icons/SoundSourceIcons';

// Button component for PresetMenu in Band-Pass-App
const PresetButton = ( {label, onClick, imageName, sourceType } ) => {

    function handleClick() {
        onClick(label);
    }

    return (
        <div className='preset-wrapper'>
            <button onClick={handleClick} className='preset-button'>
                <div>
                    {sourceType === 'bug' && <BeetleIcon/>}
                    {sourceType === 'bird' && <BirdIcon/>}
                    {sourceType === 'owl' && <OwlIcon/>}
                    {sourceType === 'frog' && <FrogIcon/>}
                    {sourceType === 'car' && <CarIcon/>}
                </div>
                {label}
                {/* {imageName && (
                    <img className='preset-image' src={`./images/${imageName}`}/>
                )} */}
            </button>
        </div>
    );
}

export default PresetButton;