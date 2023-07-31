import React, { useState, useEffect } from 'react';
import { getProtocol, initProtocol, givePerms, generateRequest, generateOpenRequest } from '../dwn/protocol';

export function DidPerm(props) {
    const [targetDid, setTargetDid] = useState('');
    const [permWrite, setPermWrite] = useState(false);
    const [permRead, setPermRead] = useState(false);
    const [permProtocolData, setPermProtocolData] = useState('')


    function reset(){
        setPermWrite(false)
        setPermRead(false)
        setPermProtocolData(false)
    }

    async function grantPerms(){
        let messages = []
        if(permRead) messages.push(await props.dwn.createPermissionsGrant('RecordsQuery', permProtocolData, props.did, targetDid))
        if(permWrite) messages.push(await props.dwn.createPermissionsGrant('RecordsWrite', permProtocolData, props.did, targetDid))

        messages.forEach(msg => {
            console.log(msg)
            props.dwn.send(msg)
        });
    };

    async function requestPerms(){
        console.log('requesting perms')
        let messages = []
        if(targetDid === ''){
            if(permRead) messages.push(await props.dwn.createPermissionsOpenRequest('RecordsQuery', permProtocolData, props.did))
            if(permWrite) messages.push(await props.dwn.createPermissionsOpenRequest('RecordsWrite', permProtocolData, props.did))

            //generate QR code?
        }else{
            if(permRead) messages.push(await props.dwn.createPermissionsRequest('RecordsQuery', permProtocolData, props.did, targetDid))
            if(permWrite) messages.push(await props.dwn.createPermissionsRequest('RecordsWrite', permProtocolData, props.did, targetDid))

            messages.forEach(msg => {
                props.dwn.send(msg)
            });
        }
        
        
    }

    return (
        <div>
            <h1>DWN Permissions</h1>
            <label>
                Recipient:
                <input type="text" value={targetDid} onChange={(event) => setTargetDid(event.target.value)} style={{ width: 500 }} />
            </label>

            <br />
            <br />

            <label>
                Protocol:
                <input type="text" value={permProtocolData} onChange={(event) => setPermProtocolData(event.target.value)} style={{ width: 500 }} />
            </label>

            <br />
            <br />

            <label>
                Write:
                <input type="checkbox" checked={permWrite} onChange={(event) => setPermWrite(event.target.checked)} />
            </label>

            <br />
            <br />

            <label>
                Read:
                <input type="checkbox" checked={permRead} onChange={(event) => setPermRead(event.target.checked)} />
            </label>

            <br />
            <br />


            <button onClick={requestPerms}>Request</button>
            <button onClick={grantPerms}>Grant</button>

        </div>
    )

}

export default DidPerm