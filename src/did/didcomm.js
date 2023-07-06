import React, { useState, useEffect } from 'react';
import { DIDComm } from '../didcomm/didcomm';

export function DidComm(props) {
    const [targetDid, setTargetDid] = useState('')
    const [message, setMessage] = useState('')

    let didComm = new DIDComm()

    const handleRequest = () => {
        didComm.buildSendMessage(props.did, targetDid) //TODO message through code
    }

    return (
        <div>

            <h1>DIDComm</h1>

            <br />
            <br />

            <label>
            Recipient:
            <input type="text" value={targetDid} onChange={(event) => setTargetDid(event.target.value)} style={{ width: 500 }} />
            </label>
    
            <br />
            <br />

            <label>
            Send Message:
            <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} style={{ width: 500 }} />
            </label>
    
            <br />
            <br />
    
            <button onClick={handleRequest}>Send Message</button>

            <br />
            <br />


        </div>
        
        
    )
    
}

export default DidComm