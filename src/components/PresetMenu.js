import { useContext, useState } from 'react';
import './PresetMenu.css';
import SidebarIcon from './icons/SidebarIcon';
import BandContext from '../contexts/BandContext';

function hertzToString(hertz) {
    const hertzFloat = parseFloat(hertz);
    if (hertzFloat >= 1000) {
        return `${hertzFloat / 1000}kHz`
    } else {
        return `${hertz}hz`
    }
}

const PresetMenu = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [bandParams, setBandParams, bandActive, setBandActive] = useContext(BandContext);
    const [presets, setPresets] = useState({
        'All': {centerFreq: 1000, lowFreq: 0, highFreq: 24000},
        'Road Noise': {centerFreq: 250, lowFreq: 0, highFreq: 2000},
        'Great Horned Owl': {centerFreq: 285, lowFreq: 225, highFreq: 360},
        "Strecker's Chorus Frog": {centerFreq: 2150, lowFreq: 1800, highFreq: 2600},
        'Tree Cricket': {centerFreq: 2850, lowFreq: 2500, highFreq: 3200},
        'Central Texas Leaf-Katydid': {centerFreq: 5000, lowFreq: 4200, highFreq: 5800},
        'Great Anglewing and Broad-tipped Conehead': {centerFreq: 13000, lowFreq: 9000, highFreq: 16000}
    });

    function handlePresetSelect(e) {
        // Get value of target row (using event from td)
        const targetName = e.target.parentNode.dataset.value;
        const targetDict = presets[targetName];
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
        <div id='preset-menu-wrapper' className={isOpen?'menu-open':'menu-closed'}>
        {(isOpen && presets) ? (
            <div id='preset-menu'>
                <div id='open-sidebar-icon' className='sidebar-icon-wrapper' onClick={handleOpenMenu}>
                    <SidebarIcon/>
                </div>
                <div id='menu-header'>
                    <h2> Sound Select: </h2>
                </div>
                <div id='presets-table-wrapper'>
                    <table id='presets-table'>
                        <tbody>
                            {/* <th colspan='2' id='presets-header'> Presets: </th> */}
                            {Object.keys(presets).map((presetName, i) => {
                                return (
                                    <tr 
                                        key={i} 
                                        className='preset-row' 
                                        onClick={handlePresetSelect}
                                        data-value={presetName}
                                    >
                                        <td className='preset-name'>
                                            {presetName}
                                        </td>
                                        <td className='preset-frequencies'>
                                            {hertzToString(presets[presetName].lowFreq)} - {hertzToString(presets[presetName].highFreq)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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

export default PresetMenu;