import React, { useState, useEffect } from 'react';
import { DidKeyResolver} from 'fork-of-dwn-sdk-js';
import { initProtocol } from '../dwn/protocol';
import { DidPerm, DidReader, DidWriter, DidPermReader } from './index'
import { DwnHelper } from '../dwn/dwn';

export function DidForm(props) {


  const [didData, setDidData] = useState('')
  const [dwnTarget, setDwnTarget] = useState('https://a064-152-37-95-108.ngrok-free.app')
  const [dwn, setDwn] = useState(undefined)

  useEffect(() => {
    setDwn(new DwnHelper(dwnTarget))
    async function startDwn(){
      await dwn.init()
    } 
    startDwn()
  }, [dwnTarget])

  const handleDid = async () => {
    var e = document.getElementById("didMethod");
    var value = e.value;
    if(value == 'ion'){
      let iondid = await dwn.generateIonDid()
      // let iondid = {
      //    "did": "did:ion:EiAscO78qb_4aefH1aTd5ygoDmcxXvrF6TF8ijvhuYTFbw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJNU3lvcUhCNDFiSml0amFRenBWbExrNlIxZU9NUkl0N2ZFaEdid3dpd2NVIiwieSI6Ik5qNEotUnphc1hUUjZjZWFXa1NmX0VfM2lpLXhGSnBKYXVKcGljQVRPam8ifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ3JHYXNZaXRVZS15azRfcUJlaS1kMm9mVlNWTjN1eklsYUM1ZUFrMC1GSVEifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUJxSllzYTFQRURDRGxMbmpjTlBZb0YxOWJsalRlSlRfaFJDVkNQNWVWU1dnIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCWk11X3NqT3ZXaUZzYzFtaW83Zk1vWmU3SEZlNGNXdHF0ZVk3M2lCSzhYQSJ9fQ",
      //    "keyId": "did:ion:EiAscO78qb_4aefH1aTd5ygoDmcxXvrF6TF8ijvhuYTFbw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJNU3lvcUhCNDFiSml0amFRenBWbExrNlIxZU9NUkl0N2ZFaEdid3dpd2NVIiwieSI6Ik5qNEotUnphc1hUUjZjZWFXa1NmX0VfM2lpLXhGSnBKYXVKcGljQVRPam8ifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ3JHYXNZaXRVZS15azRfcUJlaS1kMm9mVlNWTjN1eklsYUM1ZUFrMC1GSVEifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUJxSllzYTFQRURDRGxMbmpjTlBZb0YxOWJsalRlSlRfaFJDVkNQNWVWU1dnIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCWk11X3NqT3ZXaUZzYzFtaW83Zk1vWmU3SEZlNGNXdHF0ZVk3M2lCSzhYQSJ9fQ#key-1",
      //    "keyPair": {
      //    "publicJwk": {
      //    "kty": "EC",
      //    "crv": "secp256k1",
      //    "x": "MSyoqHB41bJitjaQzpVlLk6R1eOMRIt7fEhGbwwiwcU",
      //    "y": "Nj4J-RzasXTR6ceaWkSf_E_3ii-xFJpJauJpicATOjo"
      //    },
      //    "privateJwk": {
      //    "kty": "EC",
      //    "crv": "secp256k1",
      //    "x": "MSyoqHB41bJitjaQzpVlLk6R1eOMRIt7fEhGbwwiwcU",
      //    "y": "Nj4J-RzasXTR6ceaWkSf_E_3ii-xFJpJauJpicATOjo",
      //    "d": "T23-toqdri-JzdkVXEP9C8O35eI7KkE5MAs-pf_trDY"
      //    }
        //  }
        // }
      console.log(iondid)
      setDidData(iondid)
    }else if(value == 'key'){
      await handleDidKey()
    }
  }

  const handleDidKey = async () => {
    const didKey = await DidKeyResolver.generate();
    setDidData(didKey)
    initProtocol(dwn, didKey)
  }


  const handleDwnChange = (event) => {
    setDwnTarget(event.target.value);
    dwn.setHost(event.target.value)
    initProtocol(dwn, didData)
  };

  

  return (
    <div>
      <h1>{props.name}</h1>
      <label>
        DID:
        <input type="text" value={didData.did} style={{ width: 500 }} />
      </label>
      <button onClick={handleDid}>Generate DID</button>

      <select id='didMethod'>
        <option value="key">did:key</option>
        <option value="ion">did:ion</option>
      </select>

      <br />
      <br />
      <br />

      {/* <DidComm dwn={dwn} did={didData} /> */}

      <br />
      <br />
      <br />

      <label>
        DWN Host:
        <input type="text" value={dwnTarget} onChange={handleDwnChange} style={{ width: 500 }} />
      </label>

      <br />
      <br />
      <br />

      <DidReader dwn={dwn} did={didData} />

      <br />
      <br />
      <br />

      <DidWriter dwn={dwn} did={didData} />

      <br />
      <br />
      <br />

      <DidPerm dwn={dwn} did={didData} />

      <br />
      <br />
      <br />

      <DidPermReader dwn={dwn} did={didData} />

      <br />
      <br />
      <br />

    


    </div>
  );
}

export default DidForm