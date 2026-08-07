// Utility for validating authentic vs temporary/disposable emails

export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular temporary/disposable email domains
  "tempmail.com", "temp-mail.org", "tempmail.net", "tempmail.org", "temp-mail.ru", "temp-mail.io", "temp-mail.id",
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamail.biz", "guerrillamail.info", "guerrillamail.de",
  "guerrillamailblock.com", "sharklasers.com", "grr.la", "10minutemail.com", "10minutemail.net", "10minutemail.org", "10minute-mail.com",
  "trashmail.com", "trashmail.net", "trashmail.org", "trashmail.me", "trashmail.at", "yopmail.com", "yopmail.fr", "yopmail.net",
  "dispostable.com", "getnada.com", "nada.ltd", "nada.kiev.ua", "abyssmail.com", "boximail.com", "clrmail.com", "dropmail.me", "dropmail.net", "dropmail.org",
  "mohmal.com", "mohmal.in", "tempail.com", "crazymailing.com", "throwawaymail.com", "throwaway.email", "maildrop.cc", "fakeinbox.com", "fakeinbox.net",
  "mailnesia.com", "tfwno.gf", "pokemail.net", "inboxalias.com", "generator.email", "disposablemail.com", "disposable.com", "tmpmail.org", "tmpmail.net",
  "tmail.ws", "emailondeck.com", "fakemailgenerator.com", "byom.de", "dayrep.com", "einrot.com", "fleckens.hu", "gustr.com", "jourrapide.com",
  "rhyta.com", "teleworm.us", "superrito.com", "armyspy.com", "cuvox.de", "minmail.net", "boun.cr", "bouncr.com", "my10minutemail.com",
  "throwawayemailaddress.com", "burnermail.io", "tempmailo.com", "tempmail.app", "tempmail.plus", "getairmail.com", "tempinbox.com", "crazymail.com",
  "get-mail.net", "disposableaddress.com", "imgof.com", "temp-email.org", "tempmail.email", "disposable.email", "fakemail.net", "mailcatch.com",
  "disposableemail.com", "mailnull.com", "inboxkitten.com", "moakt.com", "anonbox.net", "guerrillamail.com"
])

// Keywords often found in temporary / disposable email domain names
export const DISPOSABLE_KEYWORDS = [
  "tempmail", "temp-mail", "10minute", "guerrilla", "mailinator",
  "trashmail", "yopmail", "dispostable", "getnada", "tempail",
  "crazymail", "throwaway", "maildrop", "fakeinbox", "dropmail",
  "mohmal", "mailnesia", "disposable", "burnermail", "fakemail",
  "tmpmail", "tmail", "emailondeck", "byom", "teleworm", "dayrep",
  "rhyta", "anonbox", "inboxkitten", "mailnull", "mailcatch"
]

export const AUTHENTIC_EMAIL_ERROR_MESSAGE = "Temporary / disposable email addresses are not allowed. Only authentic email addresses are permitted."

/**
 * Checks whether an email is from a temporary or disposable email provider.
 * @param email The email address to check
 * @returns boolean true if email is temporary/disposable, false otherwise
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false
  const cleanEmail = email.trim().toLowerCase()
  const parts = cleanEmail.split("@")
  if (parts.length !== 2) return false

  const domain = parts[1]
  if (!domain) return false

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true
  }

  return DISPOSABLE_KEYWORDS.some((keyword) => domain.includes(keyword))
}
