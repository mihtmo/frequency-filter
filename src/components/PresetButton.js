import './PresetButton.css'
import InfoIcon from './icons/InfoIcon';
import { BeetleIcon, BirdIcon, CarIcon, FrogIcon, OwlIcon } from './icons/SoundSourceIcons';
import PresetInfoButton from './PresetInfoButton';

// Button component for PresetMenu in Band-Pass-App
const PresetButton = ( { label, itemDict, onClick, isSelected } ) => {

    function handleClick() {
        onClick(label);
    }

    return (
        <div className='preset-wrapper' data-selected={isSelected}>
            <button onClick={handleClick} className='preset-button'>
                <div>
                    {itemDict?.sourceType === 'bug' && <BeetleIcon/>}
                    {itemDict?.sourceType === 'bird' && <BirdIcon/>}
                    {itemDict?.sourceType === 'owl' && <OwlIcon/>}
                    {itemDict?.sourceType === 'frog' && <FrogIcon/>}
                    {itemDict?.sourceType === 'car' && <CarIcon/>}
                </div>
                {label}
            </button>
            {itemDict?.image && <PresetInfoButton itemDict={itemDict}/>}
        </div>
    );
}

export default PresetButton;