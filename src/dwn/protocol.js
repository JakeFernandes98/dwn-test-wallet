import { ProtocolsConfigure, ProtocolsQuery, PermissionsGrant, PermissionsRequest, PermissionsOpenRequest } from 'fork-of-dwn-sdk-js';

export async function initProtocol(dwn, did) {

    let protocol = 'neomvp'
    let definition = {
        'labels': {
            'accessibility': {
                'schema': 'neomvp/accessibility'
            },
            'dietary': {
                'schema': 'neomvp/dietary'
            },
            'receipt': {
                'schema': 'neomvp/receipt'
            },
        },
        'records': {
            'accessibility': {
                'allow': {
                    'anyone': {
                        'to': [
                            'write'
                        ]
                    }
                }
            },
            'dietary': {
                'allow': {
                    'anyone': {
                        'to': [
                            'write'
                        ]
                    }
                }
            },
            'receipt': {
                'allow': {
                    'anyone': {
                        'to': [
                            'write'
                        ]
                    }
                }
            },

        }
    }

    const message = await dwn.createProtocol(protocol, definition, did, did.did)
    const result = await dwn.send(message);
    console.log(result)
}

// export async function getProtocol(did, signatureMaterial, dwnTarget) {
//     const opts = {
//         // filter: { protocol: 'chat' },
//         filter: { protocol: 'neomvp' },
//         target: did,
//         signatureInput: signatureMaterial,
//     }

//     console.log(opts)

//     const protocolsQuery = await ProtocolsQuery.create(opts);

//     const protocolsQueryJSON = protocolsQuery.toJSON();
//     console.log(protocolsQueryJSON);

//     const result = await dwn.send(dwnTarget, protocolsQueryJSON);
//     console.log(result)
// }