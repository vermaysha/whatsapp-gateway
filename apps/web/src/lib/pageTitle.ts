export function pageTitle(title: string): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Whatsapp Gateway"
  return `${title} | ${appName}`
}
