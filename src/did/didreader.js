import { Dwn } from 'fork-of-dwn-sdk-js';
import React, { useState, useEffect } from 'react';

export function DidReader(props) {

    const [readRec, setReadRec] = useState('');
    const [readResponse, setReadResponse] = useState('')


    const handleRead = async () => {

        let msg = await props.dwn.createRecordsQuery('neomvp','neomvp/accessibility',props.did, readRec == '' ? props.did.did : readRec)
        let response = await props.dwn.send(msg)
        let data = props.dwn.decodeRecordsQueryData(response)
        let str = ""
        data.forEach(d => {
            str+=d.toString()
        });
        str+="\n"
        setReadResponse(str)
    };


    return (
        <div>
            <h1>Read from DWN</h1>
            <label>
                Recipient:
                <input type="text" value={readRec} onChange={(event) => setReadRec(event.target.value)} style={{ width: 500 }} />

            </label>

            <br />
            <br />

            <button onClick={handleRead}>Read Records</button>

            <br />
            <textarea type="text" value={readResponse} style={{ width: 500, height: 500 }} />
        </div>
    )



}

export default DidReader