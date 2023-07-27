/**
 * Formats a phone number by removing the prefix "62", "+62", or "0",
 * then separating the phone number into four parts and joining them with spaces.
 *
 * @param {string} phoneNumber - The phone number to be formatted.
 * @returns {string} The formatted phone number.
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Menghapus awalan "62", "+62", atau "0"
  const phoneNumberWithoutSuffix = phoneNumber.split("@")[0]

  const cleanedPhoneNumber = phoneNumberWithoutSuffix.replace(
    /^(62|\+62|0)/,
    "+62",
  )

  // Memisahkan nomor telepon menjadi 4 bagian
  const part1 = cleanedPhoneNumber.substring(0, 3)
  const part2 = cleanedPhoneNumber.substring(3, 7)
  const part3 = cleanedPhoneNumber.substring(7, 11)
  const part4 = cleanedPhoneNumber.substring(11)

  // Menggabungkan keempat bagian dengan tanda spasi
  const finalFormattedPhoneNumber = `${part1} ${part2} ${part3} ${part4}`

  return finalFormattedPhoneNumber
}
