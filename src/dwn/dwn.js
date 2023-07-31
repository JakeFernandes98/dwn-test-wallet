import { Dwn, ProtocolsConfigure, RecordsQuery, RecordsWrite, PermissionsRequest, PermissionsGrant, PermissionsReject, PermissionsOpenRequest, PermissionsRead, Encoder } from 'fork-of-dwn-sdk-js';
import { anchor, DID, generateKeyPair, resolve } from '@decentralized-identity/ion-tools';
import {useState} from 'react'
// import fetch from "node-fetch";

export class DwnHelper {

  dwn
  host

  constructor(host) {
    this.dwn = undefined
    this.host = host
  }

  /**
   * 
   * @returns {Promise<Dwn>}
   */
  async init() {
    if (this.dwn === undefined) {
      this.dwn = await Dwn.create({});
      return this.dwn;
    }
  }

  setHost(_host){
    console.log('this is the host',_host)
    this.host = _host
  }

  /**
   * Generates ION DID based on @decentralized-identity/ion-tools
   * @param {string} didUri
   * @returns {Promise<object>} structuredDidKey 
   */
  async generateIonDid(dwnURL=undefined) {
    // let authnKeys = await generateKeyPair();
    let authnKeys = await generateKeyPair('Ed25519');
    let did = new DID({
      content: {
        publicKeys: [
          {
            id: 'key-1',
            // type: 'EcdsaSecp256k1VerificationKey2019',
            type: 'Ed25519',
            publicKeyJwk: authnKeys.publicJwk,
            purposes: ['authentication']
          }
        ],
        // services: [
        //   {
        //     'id': 'dwn',
        //     'type': 'DecentralizedWebNode',
        //     'serviceEndpoint': dwnURL
        //   }
        // ]
      }
    });

    
    // Generate and publish create request to an ION node
    let createRequest = await did.generateRequest(0);
    let anchorResponse = await anchor(createRequest);
    // console.log(anchorResponse)

    // if(dwnURL !== undefined){
    //   let updateOperation = await did.generateOperation('update', {
    //     addServices: [
    //       {
    //         'id': '#dwn',
    //         'type': 'DecentralizedWebNode',
    //         'serviceEndpoint': dwnURL
    //       }
    //     ]
    //   })

    //   let updateRequest = await did.generateRequest(updateOperation);
    //   let anchorResponse = await anchor(updateRequest);
    // }

    let didURI = await did.getURI()
    // console.log('diduri is ', didURI)

    let structDid = await this.structureIonDid(didURI, authnKeys)

    return structDid
  }


  /**
   * Structures ION did and keys into a format thats accepted by
   * DWN signing methods.
   * @param {string} didUri
   * @param {object} authnKeys 
   * @returns {object} structuredDidKey
   */
  async structureIonDid(didUri, authnKeys) {
    const structuredDidKey = {
      did: didUri,
      keyId: didUri + '#key-1', //TODO - remove hardcoding
      keyPair: authnKeys
    }

    return structuredDidKey
  }


  /**
   * Creates the signature input required for DWN signing methods
   * based on structuredDidKey Type
   * @param {string} structuredDidKey
   * @returns {object} signatureInput
   */
  createSignatureInput(structuredDidKey) {
    const signatureInput = {
      privateJwk: structuredDidKey.keyPair.privateJwk,
      protectedHeader: {
        alg: structuredDidKey.keyPair.privateJwk.crv,
        kid: structuredDidKey.keyId
      }
    };
    return signatureInput
  }

  /**
  * TODO Resolved DIDDoc for DWN Endpint
  * @param {string} didUri
  * @returns {Promise<String>} dwnEndpoint
  */
  async getDwnEndpoint(didUri){
    const didDoc = await resolve(didUri)
    let services = didDoc["didDocument"]["service"]

    services.forEach(element => {
      if(element['id'] === '#dwn'){
        return element['serviceEndpoint']
      }
    });
  }

  /**
   * Sends provided message to provided host
   * @param {string} host 
   * @param {object} message 
   */
  async send(message) {
    console.log(this.host)
    // TODO: handle request failure
    if (this.host == undefined) throw new Error("Requires host")
    console.log('sending dwn message to', this.host);
    // TODO: remove /dwn
    const response = await fetch(`${this.host}/dwn`, {
      method: 'POST',
      body: JSON.stringify(message)
    });

    // TODO: handle non-200 responses
    return response.json();
  }

  /**
   * Creates a ProtocolConfigure message
   * @param {string} protocolName 
   * @param {object} protocolDefinition 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<ProtocolsConfigure>}
   */
  async createProtocol(protocolName, protocolDefinition, structuredDidKey, targetDid) {
    const signatureMaterial = this.createSignatureInput(structuredDidKey)
    let protocol_config = {
      method: 'ProtocolsConfigure',
      message: {
        protocol: protocolName,
        definition: protocolDefinition
      }
    };

    const opts = {
      target: targetDid,
      signatureInput: signatureMaterial,
      ...protocol_config.message
    }

    const protocolsConfigure = await ProtocolsConfigure.create(opts);
    // console.log(protocolsConfigure)

    return protocolsConfigure.toJSON();
  }

  // async getProtocol(){


  // }
  

  /**
   * Creates a RecordsQuery message (TODO, add more filtering options)
   * @param {string} protocolName 
   * @param {string} protocolSchema 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<RecordsQuery>}
   */
  async createRecordsQuery(protocolName, protocolSchema, structuredDidKey, targetDid, additionalFilter={}) {
    console.log(protocolName, protocolSchema, structuredDidKey, targetDid)
    const signatureMaterial = this.createSignatureInput(structuredDidKey)
    const query = {
      filter: {
        protocol: protocolName,
        schema: protocolSchema,
        ...additionalFilter
      },
      dateSort: 'createdAscending'
    }

    const queryOptions = {
      ...query,
      target: targetDid,
      signatureInput: signatureMaterial
    };

    const recordsQuery = await RecordsQuery.create(queryOptions);
    return recordsQuery.toJSON()
  }

    /**
   * Creates a RecordsQuery message (TODO, add more filtering options)
   * @param {string} protocolName 
   * @param {string} protocolSchema 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<RecordsQuery>}
   */
     async createPermissionsRead(structuredDidKey, targetDid, filter={}) {
      const signatureMaterial = this.createSignatureInput(structuredDidKey)
      const query = {
        filter: {
          ...filter
        },
        dateSort: 'createdAscending'
      }
  
      const queryOptions = {
        ...query,
        target: targetDid,
        signatureInput: signatureMaterial
      };
  
      const recordsQuery = await PermissionsRead.create(queryOptions);
      return recordsQuery.toJSON()
    }

  /**
   * Creates a RecordsWrite message
   * @param {string} protocolName 
   * @param {string} protocolSchema 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<RecordsWrite>}
   */
  async createRecordsWrite(protocolName, protocolSchema, data, structuredDidKey, targetDid) {
    console.log(protocolName, protocolSchema, data, structuredDidKey, targetDid)
    const signatureMaterial = this.createSignatureInput(structuredDidKey)

    const jsonStringified = JSON.stringify(data);
    const jsonBytes = new TextEncoder().encode(jsonStringified);

    let recordsWriteOptions = {
      data: jsonBytes,
      dataFormat: 'application/json',
      protocol: protocolName,
      target: targetDid,
      schema: protocolSchema,
      signatureInput: signatureMaterial
    };

    const recordsWrite = await RecordsWrite.create(recordsWriteOptions);

    // console.log(recordsWrite)

    return recordsWrite.toJSON();
  }


  /**
   * Creates a PermissionsRequest message
   * @param {DwnMethodName} dwnMethodName 
   * @param {string} protocolSchema 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<PermissionsRequest>}
   */
  async createPermissionsRequest(dwnMethodName, protocolSchema, structuredDidKey, targetDid) {
    const signatureMaterial = this.createSignatureInput(structuredDidKey)
    const perm_options = {
      scope: {
        "method": dwnMethodName,
        "schema": protocolSchema,
      },
    }

    const opts = {
      ...perm_options,
      target: targetDid,
      grantedTo: structuredDidKey.did,
      grantedBy: targetDid,
      signatureInput: signatureMaterial,
    }

    const permissionsQuery = await PermissionsRequest.create(opts)
    return permissionsQuery.toJSON();
  }

  /**
   * Creates a PermissionsOpenRequest message
   * @param {DwnMethodName} dwnMethodName 
   * @param {string} protocolSchema 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<PermissionsOpenRequest>}
   */
  async createPermissionsOpenRequest(dwnMethodName, protocolSchema, structuredDidKey) {
    const signatureMaterial = this.createSignatureInput(structuredDidKey)
    const perm_options = {
      scope: {
        "method": dwnMethodName,
        "schema": protocolSchema,
      },
    }

    const opts = {
      ...perm_options,
      grantedTo: structuredDidKey.did,
      signatureInput: signatureMaterial,
    }

    const permissionsQuery = await PermissionsOpenRequest.create(opts)
    return permissionsQuery.toJSON();

  }



  /**
   * Creates a PermissionsRequest message
   * @param {DwnMethodName} dwnMethodName 
   * @param {string} protocolSchema 
   * @param {object} structuredDidKey 
   * @param {DID} targetDid 
   * @returns {Promise<PermissionsGrant>}
   */
  async createPermissionsGrant(dwnMethodName, protocolSchema, structuredDidKey, targetDid) {

    const signatureMaterial = this.createSignatureInput(structuredDidKey)
    const perm_options = {
      scope: {
        "method": dwnMethodName,
        "schema": protocolSchema,
      },
    }

    const opts = {
      ...perm_options,
      target: structuredDidKey.did,
      grantedTo: targetDid,
      grantedBy: structuredDidKey.did,
      signatureInput: signatureMaterial,
    }

    const permissionsQuery = await PermissionsGrant.create(opts)
    return permissionsQuery.toJSON();

  }

  async createPermissionsGrantFromMessage(message, structuredDidKey) {
    const signatureMaterial = this.createSignatureInput(structuredDidKey)
  
    const opts = {
      ...message.descriptor,
      target: structuredDidKey.did,
      signatureInput: signatureMaterial,
    }
  
    console.log('opts ', opts)
    const permissionsQuery = await PermissionsGrant.create(opts)
    return permissionsQuery.toJSON();
  }

  async createPermissionsRejectFromMessage(message, structuredDidKey) {
    const signatureMaterial = this.createSignatureInput(structuredDidKey)
  
    const opts = {
      ...message.descriptor,
      target: structuredDidKey.did,
      signatureInput: signatureMaterial,
    }
  
    console.log('opts ', opts)
    const permissionsQuery = await PermissionsReject.create(opts)
    return permissionsQuery.toJSON();
  }


  /**
  * Takes a PermissionsRequest object and returns a PermissionsGrant object
  * given the user has accepted the terms
    * @param {object} permissionsRequest
    * @param {object} structuredDidKey
    * @returns {Promise<object>} PermissionsGrant
  */
  async processPermission(permissionsRequest, structuredDidKey, accept) {
    console.log('this is me trying to process', permissionsRequest)
    if (accept){
      return await this.createPermissionsGrantFromMessage(permissionsRequest, structuredDidKey)
    }else{
      return await this.createPermissionsRejectFromMessage(permissionsRequest, structuredDidKey)
    }
    
  }

  

  decodeRecordsQueryEntries(result){
    result.entries.forEach(element => {
      let res = Encoder.base64UrlToObject(element.encodedData)
      element.data = res
    });

    return result
  }

  decodeRecordsQueryData(result){
    let res = []
    result.entries.forEach(element => {
      res.push(Encoder.base64UrlToObject(element.encodedData))
    });

    return res
  }


}
