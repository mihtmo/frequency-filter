import { useEffect, useState } from 'react';
import './PresetButton.css'
import InfoIcon from './icons/InfoIcon';

// Full-page overlay for preset info buttons
// TODO: Pull apart and make more universal
const PresetInfoButton = ({ itemDict }) => {
    const [isOpen, setIsOpen] = useState(false);

    function handleClick(e) {
        setIsOpen(true);
    }

    function handleOverlayClose(e) {
        e.stopPropagation();
        if (e.target.id === 'preset-info-overlay') {
            setIsOpen(false);
            console.log('hello')
        }
    }

    // Prevent body scrolling when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen])

    return (
        <div className='preset-info-button' onClick={handleClick}>
            <InfoIcon/>
            { isOpen && (
                <div id='preset-info-overlay' onClick={handleOverlayClose}>
                    <div className='preset-info-wrapper'>
                        <img className='preset-image' src={`./images/${itemDict.image}`}/>
                        <div className='preset-summary-text'>
                            <h2>{itemDict.fullName}</h2>
                        </div>
                        <div className='preset-details-text'>heyo</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PresetInfoButton;