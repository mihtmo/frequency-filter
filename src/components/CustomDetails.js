import { useState } from "react";

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
                    {(orientation === 'left' || orientation === 'both') &&
                        <span> {icon} </span>
                    }
                    <div className='details-summary-open'>
                        {openSummary}
                    </div>
                    {(orientation === 'right' || orientation === 'both') &&
                        <span> {icon} </span>
                    }
                    <div className='custom-details-body'>
                        {body}
                    </div>
                </>
            ) : (
                <>
                    {(orientation === 'left' || orientation === 'both') &&
                        <span> {icon} </span>
                    }
                    <div className='details-summary-closed'>
                        {closedSummary}
                    </div>
                    {(orientation === 'right' || orientation === 'both') &&
                        <span> {icon} </span>
                    }
                </>
            )}
        </div>
    )
}

export default CustomDetails;