import { useContext, useState } from 'react';
import './Sidebar.css';
import SidebarIcon from './icons/SidebarIcon';
import BandContext from '../contexts/BandContext';
import PresetButton from './PresetButton';
import BeetleIcon from './icons/SoundSourceIcons';


function hertzToString(hertz) {
    const hertzFloat = parseFloat(hertz);
    if (hertzFloat >= 1000) {
        return `${hertzFloat / 1000}kHz`
    } else {
        return `${hertz}hz`
    }
}

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [bandParams, setBandParams, bandActive, setBandActive] = useContext(BandContext);
    const [presets, setPresets] = useState({
        'All Frequencies': {centerFreq: 1000, lowFreq: 0, highFreq: 24000, image: null, sourceType: null},
        'Road Noise': {centerFreq: 250, lowFreq: 0, highFreq: 2000, image: null, sourceType: 'car'},
        'Horned Owl': {centerFreq: 285, lowFreq: 200, highFreq: 385, image: 'great-horned-owl.jpeg', sourceType: 'owl'},
        "Chorus Frog": {centerFreq: 2150, lowFreq: 1800, highFreq: 2600, image: 'streckers-chorus-frog.jpg', sourceType: 'frog'},
        'Tree Cricket': {centerFreq: 2850, lowFreq: 2500, highFreq: 3200, image: 'tree-cricket.jpg', sourceType: 'bug'},
        'Leaf-Katydid': {centerFreq: 5000, lowFreq: 4200, highFreq: 5800, image: 'texas-leaf-katydid.jpg', sourceType: 'bug'},
        'Anglewing & Conehead': {centerFreq: 11000, lowFreq: 7000, highFreq: 16000, image: 'conehead-and-anglewing.jpg', sourceType: 'bug'}
    });

    function handlePresetSelect(presetName) {
        const targetDict = presets[presetName];
        setBandParams({
            centerFreq: targetDict.centerFreq,
            lowFreq: targetDict.lowFreq,
            highFreq: targetDict.highFreq
        })
        setBandActive(true);
    }
    
    function handleOpenMenu() {
        setIsOpen(!isOpen);
    }

    return (
        <div id='sidebar-wrapper' className={isOpen?'menu-open':'menu-closed'}>
        {(isOpen && presets) ? (
            <div id='sidebar'>
                <div id='open-sidebar-icon' className='sidebar-icon-wrapper' onClick={handleOpenMenu}>
                    <SidebarIcon/>
                </div>
                <div id='menu-header'>
                    <h2> Sound Select: </h2>
                </div>
                <div id='preset-menu'>
                    {Object.keys(presets).map((presetName, i) => {
                        return (
                            <PresetButton
                                key={i}
                                label={presetName}
                                onClick={handlePresetSelect}
                                imageName={presets[presetName].image}
                                sourceType={presets[presetName].sourceType}/>
                        )
                    })}
                </div>
            </div>
        ):(
            <div onClick={handleOpenMenu} id='closed-sidebar-icon' className='sidebar-icon-wrapper'>
                <SidebarIcon/>
            </div>
        )}
        </div>
    )
}

export default Sidebar;