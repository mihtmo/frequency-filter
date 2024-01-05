import { useContext, useState } from 'react';
import './Sidebar.css';
import SidebarIcon from './icons/SidebarIcon';
import BandContext from '../contexts/BandContext';
import PresetButton from './PresetButton';


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
    const [currPreset, setCurrPreset] = useState(null);
    // TODO: This is a hard-corded-mess for proof-of-concept, and will read from a CSV in the future.
    const [presets, setPresets] = useState({
        'Road Noise': {centerFreq: 250, lowFreq: 0, highFreq: 2000, image: null, sourceType: 'car', fullName: 'Road Noise', scientificName: null },
        'Horned Owl': {centerFreq: 285, lowFreq: 200, highFreq: 385, image: 'great-horned-owl.jpeg', sourceType: 'owl', fullName: 'Great Horned Owl', scientificName: 'Bubo virginianus', image_attribution_link:'https://www.inaturalist.org/photos/80572766', image_attribution_text: '"Photo 80572766" by Alvaro Monter Pozos is licensed under CC BY-NC 4.0 / Photo was cropped', audio_attribution_link: 'https://www.inaturalist.org/observations/104919455', audio_attribution_text: '"Great Horned Owl" by biomule is licensed under CC BY-NC 4.0 / Audio was edited for noise and length, and combined with several other nature recordings'},
        "Chorus Frog": {centerFreq: 2150, lowFreq: 1800, highFreq: 2600, image: 'streckers-chorus-frog.jpg', sourceType: 'frog', fullName: "Strecker's Chorus Frog", scientificName: 'Pseudacris streckeri', image_attribution_link: 'https://www.inaturalist.org/photos/660886', image_attribution_text: '"Photo 660886" by Cullen Hanks is licensed under CC BY-NC 4.0 / Photo was cropped', audio_attribution_link: 'https://www.inaturalist.org/observations/10027100', audio_attribution_text: '"Strecker\'s Chorus Frog" by Joshua Lively is licensed under CC BY-NC 4.0 / Audio was edited for noise and length, and combined with several other nature recordings'},
        'Tree Cricket': {centerFreq: 2850, lowFreq: 2500, highFreq: 3200, image: 'tree-cricket.jpg', sourceType: 'bug', fullName: 'Broad-winged Tree Cricket', scientificName: 'Oecanthus californicus ssp. pictipennis', image_attribution_link: 'https://www.inaturalist.org/photos/559008', image_attribution_text: '"Photo 559008"  by Cullen Hanks is licensed under CC BY-NC 4.0 / Photo was cropped', audio_attribution_link: 'https://www.inaturalist.org/observations/443972', audio_attribution_text: '“Tree Cricket” by Cullen Hanks is licensed under CC BY-NC 4.0 / Audio was edited for noise and combined with several other nature recordings'},
        'Leaf-Katydid': {centerFreq: 7000, lowFreq: 4200, highFreq: 11000, image: 'texas-leaf-katydid.jpg', sourceType: 'bug', fullName: 'Central Texas Leaf-Katydid', scientificName: 'Paracyrtophyllus robustus', image_attribution_link: 'https://www.inaturalist.org/photos/19375787', image_attribution_text: '"Photo 19375787" by Eric Carpenter is licensed under CC BY-NC 4.0 / Photo was cropped', audio_attribution_link: 'https://www.inaturalist.org/observations/47802750', audio_attribution_text: '“Central Texas Leaf-Katydid” by cliftonladd is licensed under CC BY-NC 4.0 / Audio was edited for noise and combined with several other nature recordings'},
        'Greater Anglewing': {centerFreq: 11000, lowFreq: 7000, highFreq: 16000, image: 'anglewing.jpg', sourceType: 'bug', fullName: 'Greater Anglewing', scientificName: 'Microcentrum rhombifolium', image_attribution_link: 'https://www.inaturalist.org/photos/109499474', image_attribution_text: '"Photo 109499474" (top) by stevewalternature is licensed under CC BY-NC 4.0 / Photo was cropped and combined with other photo', audio_attribution_link: 'https://www.inaturalist.org/observations/63794260', audio_attribution_text: '“Greater Anglewing” by calebhelsel is licensed under CC BY-NC 4.0 / Audio was edited for noise and length, and combined with several other nature recordings'}
    });

    function handlePresetSelect(presetName) {
        const targetDict = presets[presetName];
        setCurrPreset(presetName);
        if (presetName === 'All Frequencies') {
            setBandActive(false);
        } else {
            setBandParams({
                centerFreq: targetDict.centerFreq,
                lowFreq: targetDict.lowFreq,
                highFreq: targetDict.highFreq
            })
            setBandActive(true);
        }
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
                    <PresetButton
                        label='All Frequencies'
                        onClick={handlePresetSelect}/>
                    {Object.keys(presets).map((presetName, i) => {
                        return (
                            <PresetButton
                                key={i}
                                label={presetName}
                                isSelected={currPreset === presetName ? true : false}
                                onClick={handlePresetSelect}
                                itemDict={presets[presetName]}/>
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