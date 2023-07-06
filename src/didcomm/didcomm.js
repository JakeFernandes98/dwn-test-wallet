// import { Message } from 'didcomm'
// import { GeneralJwsSigner } from 'fork-of-dwn-sdk-js';
// import { v4 as uuidv4 } from 'uuid';
// import { DidResolver } from './didresolver';
// import { DummySecretsResolver } from './secretresolver.js';

// export class DIDComm {

//     didResolver
//     secretsResolver

//     constructor() {
//         this.didResolver = new DidResolver([])
//         this.secretsResolver = new DummySecretsResolver([])
//     }

//     buildSendMessage(sourceDID, targetDID) {

//         const msg = new Message({
//             id: uuidv4(),
//             typ: "application/didcomm-plain+json",
//             type: "https://didcomm.org/questionanswer/1.0/question",
//             from: sourceDID,
//             to: [targetDID],
//             created_time: Date.now(),
//             expires_time: Date.now() + 1000000,
//             body: {
//                 "question_text": "Would you like to check in?",
//                 "question_detail": "Some extra check in details",
//                 "nonce": "<valid_nonce>",
//                 "signature_required": true,
//                 "valid_responses": [
//                     { "text": "Yes" },
//                     { "text": "No" }
//                 ],
//                 "expires_time": 1544722146
//             },
//         })
//     }

//     buildResponseMessage(question, answer, nonce, sourceDIDStruct, targetDID) {

//         let keyPair = sourceDIDStruct.keyPair

//         let reply = question+answer+nonce

//         let sigdata = this.sha512(reply)
//         let signature = null
//         let signer = null

//         GeneralJwsSigner.create()

//         const msg = new Message({
//             id: uuidv4(),
//             typ: "application/didcomm-plain+json",
//             type: "https://didcomm.org/questionanswer/1.0/question",
//             from: sourceDIDStruct.did,
//             to: [targetDID],
//             created_time: Date.now(),
//             expires_time: Date.now() + 1000000,
//             body: {
//                 "response": "Yes",
//                 "response_sig" : {
//                     "type": "https://didcomm.org/signature/1.0/ed25519Sha512_single",
//                     "signature": signature,
//                     "sig_data": sigdata,
//                     "signers": [signer],
//                 }
//             },
//         })
//     }

//     async pack(message, sourceDID, targetDID) {


//         const [encryptMsg, encryptMetadata] = await message.pack_encrypted(
//             targetDID,
//             sourceDID,
//             null,
//             this.didResolver,
//             this.secretsResolver,
//             {
//               forward: false
//             }
//         )

//         return encryptMsg, encryptMetadata
//     }

//     async unpack(message) {

//         const [unpackedMsg, unpackMetadata] = await Message.unpack(
//             message,
//             this.didResolver,
//             this.secretsResolver,
//             {}
//         );

//         return unpackedMsg.as_value(), unpackMetadata

//     }

//     async sha512(str) {
//         const buf = await crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str));
//         return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
//       }


// }