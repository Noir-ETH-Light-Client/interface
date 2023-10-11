import { useState } from "react";
import { shortValue } from "./service";


function Entry({ name, value }) {
    var [open, setOpen] = useState(false);

    return <div>
        <div class={`flex ${typeof value === 'object' ? 'hover' : ''}`} onClick={() => {
            if (open) setOpen(false);
            else setOpen(true);
        }}>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div>: {shortValue(value)}</div>
        </div>
        {(open && typeof value === 'object') && <div style={{ marginLeft: '20px' }}>
            {Object.entries(value).filter(([name1, value1]) => name1[0] != '_').map(([name1, value1]) =>
                <Entry name={name1} value={value1}></Entry>
            )}
            <div style={{ color: '#855050', cursor: 'pointer' }} onClick={() => setOpen(false)}>Show Less</div>
        </div>}

    </div>
}

export default Entry;