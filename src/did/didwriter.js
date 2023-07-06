import React, { useState, useEffect } from 'react';

export function DidWriter(props) {

    const [writeRec, setWriteRec] = useState('');
    const [writeVis, setWriteVis] = useState(false);
    const [writeMob, setWriteMob] = useState(false);

    const handleWrite = async () => {

        const data = {
            date: new Date(),
            "Vision": writeVis,
            "Mobility": writeMob
        }

        const recordsWrite = await props.dwn.createRecordsWrite('neomvp', 'neomvp/accessibility', data, props.did, writeRec == '' ? props.did.did : writeRec)
        const sendResult = await props.dwn.send(recordsWrite);
        console.log(sendResult)
    };


    return (
        <div>
            <h1>Write from DWN</h1>

            <label>
                Recipient:
                <input type="text" value={writeRec} onChange={(event) => setWriteRec(event.target.value)} style={{ width: 500 }} />

            </label>

            <br />
            <br />

            <label>
                Vision:
                <input type="checkbox" checked={writeVis} onChange={(event) => setWriteVis(event.target.checked)} />
            </label>

            <br />
            <br />

            <label>
                Mobility:
                <input type="checkbox" checked={writeMob} onChange={(event) => setWriteMob(event.target.checked)} />
            </label>

            <br />
            <br />
            <button onClick={handleWrite}>Send Write</button>
        </div>
    )

}

export default DidWriter