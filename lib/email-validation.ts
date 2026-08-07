<<<<<<< HEAD
// Comprehensive utility for validating authentic vs temporary/disposable emails

// Known major authentic email provider domains
export const AUTHENTIC_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "google.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.fr", "yahoo.es", "yahoo.de", "yahoo.in", "yahoo.ca", "ymail.com", "rocketmail.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com", "passport.com", "office365.com",
  "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me",
  "aol.com", "zoho.com", "zohomail.com",
  "gmx.com", "gmx.de", "gmx.net", "gmx.at", "web.de",
  "mail.ru", "yandex.ru", "yandex.com", "rambler.ru",
  "fastmail.com", "fastmail.fm",
  "tutanota.com", "tuta.io", "tutanota.de",
  "comcast.net", "sbcglobal.net", "verizon.net", "cox.net", "att.net", "charter.net",
  "rediffmail.com", "qq.com", "163.com", "126.com", "sina.com"
])

// Popular temporary / disposable email provider domains
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com", "temp-mail.org", "tempmail.net", "tempmail.org", "temp-mail.ru", "temp-mail.io", "temp-mail.id", "temp-mail.de", "tempmail.dev", "tempmail.us", "tempmail.live", "tempmail.co", "tempmail.cc", "tempmail.pw", "temp-mail.world", "tempmail.pro", "tempmail.ninja", "tempmail.fun", "temp-mail.biz", "tempmail.services", "temp-mail.info", "tempmail.rocks", "tempmailo.com", "tempmail.app", "tempmail.plus", "temp-email.org", "tempmail.email", "tmpmail.org", "tmpmail.net", "tmpeml.com", "tmpbox.net", "mytemp.email", "mail-temp.com",
  "mailinator.com", "mailinator.net", "mailinator2.com", "mailinator.org",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamail.biz", "guerrillamail.info", "guerrillamail.de", "guerrillamailblock.com", "grr.la", "sharklasers.com",
  "10minutemail.com", "10minutemail.net", "10minutemail.org", "10minute-mail.com", "10minute.xyz", "10minutemail.co.uk", "10minutemail.info", "10minmail.fr", "my10minutemail.com",
  "trashmail.com", "trashmail.net", "trashmail.org", "trashmail.me", "trashmail.at", "trashmail.se", "trashmail.io",
  "yopmail.com", "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf", "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf",
  "dispostable.com", "getnada.com", "nada.ltd", "nada.kiev.ua", "abyssmail.com", "boximail.com", "clrmail.com", "dropmail.me", "dropmail.net", "dropmail.org",
  "mohmal.com", "mohmal.in", "mohmal.im", "tempail.com", "crazymailing.com", "throwawaymail.com", "throwaway.email", "throwawayemailaddress.com", "maildrop.cc", "fakeinbox.com", "fakeinbox.net", "fakemail.net", "fakemailgenerator.com", "fake-email.pp.ua",
  "mailnesia.com", "tfwno.gf", "pokemail.net", "inboxalias.com", "generator.email", "emailgenerator.io", "disposablemail.com", "disposable.com", "disposable.email", "disposable.site", "disposableaddress.com", "disposableemail.com",
  "tmail.ws", "tmailor.com", "tmail.io", "emailondeck.com", "byom.de", "dayrep.com", "einrot.com", "fleckens.hu", "gustr.com", "jourrapide.com", "rhyta.com", "teleworm.us", "superrito.com", "armyspy.com", "cuvox.de", "minmail.net", "boun.cr", "bouncr.com",
  "burnermail.io", "burner.cc", "getairmail.com", "tempinbox.com", "crazymail.com", "get-mail.net", "imgof.com", "mailcatch.com", "mailnull.com", "inboxkitten.com", "moakt.com", "moakt.ws", "anonbox.net",
  "secmail.pro", "secmail.net", "secmail.org", "receive-mail.com", "inboxclean.com", "spamgourmet.com"
])

// Keywords matching temporary / disposable email provider domain names
export const DISPOSABLE_KEYWORDS = [
  "tempmail", "temp-mail", "10minute", "10min", "guerrilla", "mailinator",
  "trashmail", "yopmail", "dispostable", "getnada", "tempail",
  "crazymail", "throwaway", "maildrop", "fakeinbox", "dropmail",
  "mohmal", "mailnesia", "disposable", "burnermail", "fakemail",
  "tmpmail", "tmpeml", "tmpbox", "tmail", "emailondeck", "byom", "teleworm", "dayrep",
  "rhyta", "anonbox", "inboxkitten", "mailnull", "mailcatch", "secmail",
  "sharklaser", "grr.la", "getairmail", "tempinbox", "junkmail", "trash",
  "dispos", "burner", "spamgourmet", "receive-mail", "fake-email"
]

export const AUTHENTIC_EMAIL_ERROR_MESSAGE = "Temporary / disposable email addresses are not allowed. Please use an authentic email address."

/**
 * Checks whether an email address is from a temporary or disposable email service.
 * @param email The email address string to validate
 * @returns boolean true if the email is disposable/temporary, false if it is authentic
=======
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
>>>>>>> 4b72ca1b854d6ac18bfe75f77fa31e8f53e4378b
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false
  const cleanEmail = email.trim().toLowerCase()
  const parts = cleanEmail.split("@")
  if (parts.length !== 2) return false

<<<<<<< HEAD
  const domain = parts[1]?.trim()
  if (!domain) return false

  // 1. If domain is a known authentic email provider (e.g. gmail.com, yahoo.com, etc.), it is authentic
  if (AUTHENTIC_EMAIL_DOMAINS.has(domain)) {
    return false
  }

  // 2. Check for educational, government, or academic domains (always authentic)
  if (
    domain.endsWith(".edu") ||
    domain.endsWith(".edu.au") ||
    domain.endsWith(".edu.cn") ||
    domain.endsWith(".edu.in") ||
    domain.endsWith(".ac.uk") ||
    domain.endsWith(".gov") ||
    domain.endsWith(".gov.in") ||
    domain.endsWith(".gov.uk") ||
    domain.endsWith(".mil")
  ) {
    return false
  }

  // 3. Check against explicit disposable domain list
=======
  const domain = parts[1]
  if (!domain) return false

>>>>>>> 4b72ca1b854d6ac18bfe75f77fa31e8f53e4378b
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true
  }

<<<<<<< HEAD
  // 4. Check against disposable keyword list
=======
>>>>>>> 4b72ca1b854d6ac18bfe75f77fa31e8f53e4378b
  return DISPOSABLE_KEYWORDS.some((keyword) => domain.includes(keyword))
}
