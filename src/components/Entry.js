import { useState } from "react";
import { shortValue } from "../service";


function Entry({ name, value, isOpen = false }) {
    var [open, setOpen] = useState(isOpen);

    return <div>
        <div class={`flex ${typeof value == 'object' ? 'hover' : ''}`} onClick={() => {
            if (open) setOpen(false);
            else if (typeof value == 'object') setOpen(true);
        }}>
            <h3 style={{ fontWeight: 'bold' }}>{name}: </h3>
            {!open && <h3>{shortValue(value)}</h3>}
        </div>
        {(open && typeof value === 'object') && <div style={{ marginLeft: '20px' }}>
            {Object.entries(value).filter(([name1, _value1]) => name1[0] != '_').map(([name1, value1]) =>
                <Entry name={name1} value={value1}></Entry>
            )}
            <h4 style={{ cursor: 'pointer' }} onClick={() => setOpen(false)}>SHOW LESS</h4>
        </div>}

    </div>
}

export default Entry;