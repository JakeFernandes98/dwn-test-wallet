
// import { DIDResolver, DIDDoc } from "didcomm";
// import { DidIonResolver, DidKeyResolver, DidMethodResolver, DidResolutionResult } from "fork-of-dwn-sdk-js";

// export class DidResolver{
//    cache

//   didResolvers

//   constructor(knownDids) {
//     knownDids.forEach(element => {
//       this.cache[element["id"]] = element
//     });

//     let resolvers = [
//       new DidIonResolver(),
//       new DidKeyResolver()
//     ]

//     this.didResolvers = new Map();

//     for (const resolver of resolvers) {
//       this.didResolvers.set(resolver.method(), resolver);
//     }
//   }


//   async resolve(did) {
//     // naively validate requester DID

//     const splitDID = did.split(':', 3);

//     const didMethod = splitDID[1];
//     const didResolver = this.didResolvers.get(didMethod);

//     if (!didResolver) {
//       throw new Error(`${didMethod} DID method not supported`);
//     }

//     // use cached result if exists
//     const cachedResolutionResult = await this.cache.get(did);
//     try{
//       const resolutionResult = cachedResolutionResult ?? await (await didResolver.resolve(did)).didDocument;
//       if(resolutionResult === null) return resolutionResult;
  
//       if (cachedResolutionResult === undefined) {
//         await this.cache.set(did, resolutionResult);
//       }
  
//       return resolutionResult;
//     }catch{
//       return null
//     }
    
//   }
// }