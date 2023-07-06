// import { Secret, SecretsResolver } from "didcomm";

// export class DummySecretsResolver {
//     knownSecrets;
  
//     constructor(knownSecrets) {
//       this.knownSecrets = knownSecrets;
//     }
  
//     async get_secret(secretId) {
//       return this.knownSecrets.find((secret) => secret.id === secretId) || null;
//     }
  
//     async find_secrets(secretIds){
//       return secretIds.filter((id) =>
//         this.knownSecrets.find((secret) => secret.id === id)
//       );
//     }
//   }