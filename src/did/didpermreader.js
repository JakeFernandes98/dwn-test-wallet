import React, { useState, useEffect } from 'react';
import PermissionRequests from '../utils/selector'
export function DidPermReader(props){

    const [readRec, setReadRec] = useState('');
    const [readResponse, setReadResponse] = useState(undefined)


    const acceptPerms = async (permissions) => {
        console.log("passthru, ", permissions)
        permissions.forEach(async i => {
            let msg = await props.dwn.processPermission(i,props.did, true)
            let response = await props.dwn.send(msg)
        });
    }

    const rejectPerms = async (permissions) => {
        console.log("passthru, ", permissions)
        permissions.forEach(async i => {
            let msg = await props.dwn.processPermission(i,props.did, false)
            let response = await props.dwn.send(msg)
        });
    }

    const handleRead = async () => {

        let msg = await props.dwn.createPermissionsRead(props.did, readRec == '' ? props.did.did : readRec)
        let response = await props.dwn.send(msg)
        let data = response.entries
        // let str = ""
        // data.forEach(d => {
        //     str+=JSON.stringify(d)
        // });
        // str+="\n"
        setReadResponse(data)
    };


    return (
        <div>
            <h1>Fetch Outstanding Permissions</h1>
            <label>
                Recipient:
                <input type="text" value={readRec} onChange={(event) => setReadRec(event.target.value)} style={{ width: 500 }} />

            </label>

            <br />
            <br />

            <button onClick={handleRead}>Read Records</button>

            <br />
            <PermissionRequests permissions={readResponse} handleAccept={acceptPerms} handleReject={rejectPerms} />
        </div>
    )


}

export default DidPermReader