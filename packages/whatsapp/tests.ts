// import { fork } from 'child_process'
import whatsapp from './src/whatsapp/whatsapp'
// import { OutputMessage, jidNormalizedUser } from './src'

import { BufferJSON } from '@whiskeysockets/baileys'

whatsapp.start('f5ee1a22-db16-4f4f-bcd2-308b501e15c6')

// // const jid = '62895346266988@s.whatsapp.net'

// // setTimeout(async () => {
// //   // whatsapp.socket
// //   //   ?.sendMessage('62895346266988@s.whatsapp.net', {
// //   //     text: 'lorem ipsum',
// //   //   })
// //   //   .then((res) => {
// //   //     console.log(res, JSON.stringify(res))
// //   //   })
// //   //   .catch((err) => {
// //   //     console.log(err)
// //   //   })

// //   console.log(whatsapp.socket?.user)
// //   console.group(jidNormalizedUser(whatsapp.socket?.user?.id))

// //   console.log(await whatsapp.socket?.fetchStatus(jid))

// //   console.log(await whatsapp.socket?.profilePictureUrl(jid, 'image'))

// //   whatsapp.socket?.ev.on('messages.upsert', (data) => {
// //     console.log(data)
// //     data.messages[0].message
// //   })

// //   whatsapp.socket?.ev.on('chats.upsert', (chat) =>
// //     console.log('chats.upsert', chat),
// //   )

// //   whatsapp.socket?.ev.on('chats.update', (chat) =>
// //     console.log('chats.update', chat),
// //   )

// //   whatsapp.socket?.ev.on('chats.delete', (chat) =>
// //     console.log('chats.delete', chat),
// //   )

// //   whatsapp.socket?.ev.on('contacts.upsert', (contacts) =>
// //     console.log('contacts.upsert', contacts),
// //   )

// //   whatsapp.socket?.ev.on('contacts.update', (contacts) =>
// //     console.log('contacts.update', contacts),
// //   )

// //   whatsapp.socket?.ev.on('messages.upsert', (message) => {
// //     console.log('messages.upsert', message, message.messages[0])
// //     console.log(
// //       'messages.upsert',
// //       JSON.stringify(message.messages[0]).length,
// //       Buffer.from(JSON.stringify(message.messages[0])).length,
// //     )
// //   })

// //   whatsapp.socket?.ev.on('messages.update', (message) =>
// //     console.log('messages.update', message[0]),
// //   )
// // }, 10_000)

// const json =
//   '{"noiseKey":{"private":{"type":"Buffer","data":"4BSykA46qM//SW11OAsGoWYDowHm5kxhDHhSl7akw0o="},"public":{"type":"Buffer","data":"efTP+6/o/2CE1aV3RYnBZ455r2lQahfpDGEqI0J2KQA="}},"pairingEphemeralKeyPair":{"private":{"type":"Buffer","data":"UE/5miE0RDxzetBsyn7+X1MrkjlbeCpxGwlZmPpe3mc="},"public":{"type":"Buffer","data":"eCVacGWOxUdr9Msb7oJ+J+sdYvBAJKPNkibblTtaOCM="}},"signedIdentityKey":{"private":{"type":"Buffer","data":"YNZERSOGYlKK5j1LWjFUD8oNmeiaU2ApapYcI70KOWY="},"public":{"type":"Buffer","data":"vrkij4Fmj9zVKzYuEA4nCqJSMcFEgPl8sz5SlAAPM08="}},"signedPreKey":{"keyPair":{"private":{"type":"Buffer","data":"SHS7tfcAzXPRgkjkEkdFhNFy1KK/I3HWq/8kdAlt02I="},"public":{"type":"Buffer","data":"1WjeqGP4wthEpYJa/KLkp+KzfgN7Kh3B+2eq7xosdEk="}},"signature":{"type":"Buffer","data":"JA5D/Jus/Pr05OS4U2msnk2ZLIeKB2bbtgMLVRzxoDFFV79M8Ah2q/Ua7EAIaRvv5kAP3rvLjqT+OFDWHcV4ig=="},"keyId":1},"registrationId":176,"advSecretKey":"7JdlqNesNwWUunXL+uDNvb3052MMgEzq2hqExRPz5J0=","processedHistoryMessages":[{"key":{"remoteJid":"6285786319105@s.whatsapp.net","fromMe":true,"id":"F4B48347D003D3D5EFB411FE84779D96"},"messageTimestamp":1690776951},{"key":{"remoteJid":"6285786319105@s.whatsapp.net","fromMe":true,"id":"A66E48DDFA2C5717B31F9700BA582C46"},"messageTimestamp":1690776952},{"key":{"remoteJid":"6285786319105@s.whatsapp.net","fromMe":true,"id":"D3878A89AE58E2E633C0D3DA0BDF6432"},"messageTimestamp":1690776956}],"nextPreKeyId":31,"firstUnuploadedPreKeyId":31,"accountSyncCounter":1,"accountSettings":{"unarchiveChats":false},"deviceId":"oJWpSBrTSvW3f7xqAbDgtg","phoneId":"b3314b31-9da9-4591-a3bc-c79635167c0a","identityId":{"type":"Buffer","data":"nkCJiweRGZ7mNWmtt9qiFtHQiag="},"registered":false,"backupToken":{"type":"Buffer","data":"57LzY3fSAEhU3dbbA08Xe2GZuKM="},"registration":{},"account":{"details":"COL80boDEPLqnKYGGAE=","accountSignatureKey":"Z0Iaxmm9m1PLjghHe49rBSrGKLwmc4DMeVmKpHvxRm8=","accountSignature":"SP8gqZJpy8nnP6+Ys1Yurz7wh3FOlVMP4XF621JofA55zOMn4wO/c8R8p3EZ5FkjqpibXjPcx5sTKUNcHghRBA==","deviceSignature":"6tjARNF2Rt5NVyYE9FbwTrDO0GZx52SNduECtzcnIcxvpLYmpUlIPKhj75xPArfydJYn+dVNIR1i5Kni99XSgA=="},"me":{"id":"6285786319105:57@s.whatsapp.net","name":"Barbara"},"signalIdentities":[{"identifier":{"name":"6285786319105:57@s.whatsapp.net","deviceId":0},"identifierKey":{"type":"Buffer","data":"BWdCGsZpvZtTy44IR3uPawUqxii8JnOAzHlZiqR78UZv"}}],"platform":"android","lastAccountSyncTimestamp":1690777289,"myAppStateKeyId":"AAAAAFoV"}'

// const obj = JSON.parse(json, BufferJSON.reviver)

// // console.log(JSON.parse(json, BufferJSON.reviver))

// /**
//  * Converts buffers or arrays of buffers in an object to base64 strings.
//  * Recursively converts nested objects and arrays.
//  *
//  * @param obj - The object to convert.
//  * @returns The converted object.
//  */
// function encodeBuffer(obj: any): any {
//   if (typeof obj !== 'object' || !obj) {
//     return obj
//   }

//   if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
//     return {
//       type: 'Buffer',
//       data: Buffer.from(obj).toString('base64'),
//     }
//   }

//   if (Array.isArray(obj)) {
//     return obj.map(encodeBuffer)
//   }

//   const newObj: any = {}
//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       newObj[key] = encodeBuffer(obj[key])
//     }
//   }
//   return newObj
// }

// function decodeBuffer(obj: any): any {
//   if (
//     typeof obj !== 'object' ||
//     !obj ||
//     Buffer.isBuffer(obj) ||
//     obj instanceof Uint8Array
//   ) {
//     return obj
//   }

//   if (obj.type === 'Buffer') {
//     return Buffer.from(obj.data, 'base64')
//   }

//   if (Array.isArray(obj)) {
//     return obj.map(decodeBuffer)
//   }

//   const newObj: any = {}
//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       newObj[key] = decodeBuffer(obj[key])
//     }
//   }
//   return newObj
// }

// console.log(decodeBuffer(encodeBuffer(obj)))
