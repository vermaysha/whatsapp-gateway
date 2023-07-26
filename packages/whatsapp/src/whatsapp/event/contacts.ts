import type { Contact, WASocket } from '@whiskeysockets/baileys'
import { jidNormalizedUser } from '@whiskeysockets/baileys'
import { prisma } from 'database'

/**
 * Upserts a contact into the database.
 *
 * @param {Partial<Contact>} contact - The contact object to upsert.
 * @param {WASocket} sock - The WebSocket connection.
 * @return {Promise<void>} - A promise that resolves when the contact has been upserted.
 */
export async function upsertContact(
  contact: Partial<Contact>,
  sock: WASocket,
): Promise<void> {
  if (!contact.id) return

  const jid = jidNormalizedUser(contact.id)
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
    await prisma.contacts.upsert({
      where: {
        jid,
      },
      create: {
        jid,
        ...data,
      },
      update: data,
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * Processes a list of contacts and performs an upsert operation on each contact.
 *
 * @param {Partial<Contact>[]} contacts - The list of contacts to process.
 * @param {WASocket} sock - The WebSocket connection.
 * @return {Promise<void>} - A promise that resolves when all contacts have been processed.
 */
export async function contactEvent(
  contacts: Partial<Contact>[],
  sock: WASocket,
): Promise<void> {
  for (const contact of contacts) {
    await upsertContact(contact, sock)

    console.log('contactEvent', JSON.stringify({ contact }))
  }
}
