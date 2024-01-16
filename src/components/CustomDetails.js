import { useState } from "react";
import './CustomDetails.css';

// Custom details element because I'm tired of modifying the default one
const CustomDetails = ({ openSummary, closedSummary, body, customOpenIcon, customClosedIcon, iconOrientation }) => {
    const [isExpanded, setISExpanded] = useState(false);

    const openIcon = customOpenIcon ? customOpenIcon : '▼';
    const closedIcon = customClosedIcon ? customClosedIcon : '▶︎';

    const icon = isExpanded ? openIcon : closedIcon;
    const orientation = iconOrientation ? iconOrientation : 'right';

    function handleClick() {
        setISExpanded(!isExpanded);
    }

    return (
        <div className='custom-details-wrapper' onClick={handleClick}>
            {isExpanded ? (
                <>
                    <div className='details-summary-wrapper'>
                        {(orientation === 'left' || orientation === 'both') &&
                            <span className='details-icon'> {icon} </span>
                        }
                        <span className='details-summary-open details-summary'>
                            {openSummary}
                        </span>
                        {(orientation === 'right' || orientation === 'both') &&
                            <span className='details-icon'> {icon} </span>
                        }
                    </div>
                    <div className='custom-details-body'>
                        {body}
                    </div>
                </>
            ) : (
                <div className='details-summary-wrapper'>
                    {(orientation === 'left' || orientation === 'both') &&
                        <span className='details-icon'> {icon} </span>
                    }
                    <span className='details-summary-closed details-summary'>
                        {closedSummary}
                    </span>
                    {(orientation === 'right' || orientation === 'both') &&
                        <span className='details-icon'> {icon} </span>
                    }
                </div>
            )}
        </div>
    )
}

export default CustomDetails;