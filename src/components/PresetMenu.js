import { useContext, useState } from 'react';
import './PresetMenu.css';
import ChevronLeft from './ChevronLeft';
import SidebarIcon from './SidebarIcon';
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
        'Field Cricket': {centerFreq: 2750, lowFreq: 2300, highFreq: 3200},
        'Tree Cricket': {centerFreq:3300, lowFreq: 2800, highFreq: 4000},
        'Road Noise': {centerFreq: 250, lowFreq: 0, highFreq: 2000},
        'All': {centerFreq: 1000, lowFreq: 0, highFreq: 24000},
    });

    function handlePresetSelect(e) {
        const targetName = e.target.dataset.value;
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
                                    >
                                        <td className='preset-name' data-value={presetName}>
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