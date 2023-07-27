import type { Contact, WASocket } from '@whiskeysockets/baileys'
import { jidNormalizedUser } from '@whiskeysockets/baileys'
import { prisma } from 'database'

/**
 * Upserts a contact in the database with the provided information.
 *
 * @param {Partial<Contact>} contact - The partial contact object to be upserted.
 * @param {WASocket} sock - The WebSocket connection object.
 * @param {string} deviceId - The ID of the device.
 * @return {Promise<void>} - A promise that resolves when the contact is upserted successfully.
 */
export async function upsertContact(
  contact: Partial<Contact>,
  sock: WASocket,
  deviceId: string,
): Promise<void> {
  if (!contact.id) return

  const jid = jidNormalizedUser(contact.id)
  delete contact.id

  let avatar = undefined
  let status = undefined

  try {
    avatar = await sock.profilePictureUrl(jid, 'image')
  } catch (error) {}

  try {
    status = (await sock.fetchStatus(jid))?.status ?? undefined
  } catch (error) {}

  const data = {
    avatar,
    status,
    name: contact.name,
    notify: contact.notify,
    verifiedName: contact.verifiedName,
  }

  try {
    await prisma.contact.upsert({
      where: {
        jid,
      },
      create: {
        jid,
        devices: {
          connect: {
            id: deviceId,
          },
        },
        ...data,
      },
      update: data,
    })
  } catch (error) {
    console.error(error, data)
  }
}

/**
 * Processes a list of contacts and performs an upsert operation on each contact.
 *
 * @param {Partial<Contact>[]} contacts - The list of contacts to process.
 * @param {WASocket} sock - The WebSocket connection.
 * @param {string} deviceId - The ID of the device.
 * @return {Promise<void>} - A promise that resolves when all contacts have been processed.
 */
export async function contactEvent(
  contacts: Partial<Contact>[],
  sock: WASocket,
  deviceId: string,
): Promise<void> {
  for (const contact of contacts) {
    await upsertContact(contact, sock, deviceId)

    console.log('contactEvent', JSON.stringify({ contact }))
  }
}
