/**
 * A comprehensive list of known disposable / temporary email domains.
 * Block these during sign-up and sign-in to ensure only authentic emails are used.
 */
export const TEMP_MAIL_DOMAINS = new Set([
  // Mailinator family
  "mailinator.com", "mailinator2.com", "mailinator.net", "mailinator.org",
  "trashmail.com", "trashmail.me", "trashmail.net", "trashmail.io", "trashmail.at",
  "trashmail.org", "trashmail.de",
  // Guerrilla / temp services
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamail.biz",
  "guerrillamail.de", "guerrillamail.info", "guerrillamailblock.com",
  "grr.la", "sharklasers.com", "guerrillamails.com", "spam4.me",
  // 10 minute mail
  "10minutemail.com", "10minutemail.net", "10minutemail.org", "10minutemail.de",
  "10minutemail.cf", "10minutemail.ga", "10minutemail.gq", "10minutemail.ml",
  "10minutemail.tk", "10minemail.com",
  // Yopmail
  "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc",
  "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
  // Throwam / discard
  "dispostable.com", "throwam.com", "throwam.net", "discard.email",
  "discardmail.com", "discardmail.de",
  // Temp-mail / tempmail
  "temp-mail.org", "temp-mail.io", "tempmail.com", "tempmail.net",
  "tempmail.org", "tempmailo.com", "tempr.email", "temp.email",
  "tempemail.com", "temporaryemail.com", "temporary-mail.com",
  // Fake / spam helpers
  "fakeinbox.com", "fakeinbox.net", "fakeinbox.org",
  "fakemail.net", "fakemail.fr", "fakemailgenerator.com",
  "mailnull.com", "mailnull.net",
  "spamgourmet.com", "spamgourmet.net", "spamgourmet.org",
  "spamhereplease.com", "spamhere.org",
  "spamhole.com", "spaml.com",
  // Nada / burner
  "nada.email", "nada.ltd", "burnermail.io",
  "throwaway.email", "throwam.com",
  // Misc well-known temp providers
  "mailnesia.com", "mailnesia.net",
  "maildrop.cc", "mailbox.in.ua",
  "mailscrap.com", "mailexpire.com",
  "spamfree24.org", "spamfree24.de", "spamfree24.eu",
  "bccto.me", "chacuo.net", "dispostable.com",
  "mail-temporaire.fr", "jetable.net", "jetable.org", "jetable.com",
  "filzmail.com", "filzmail.de",
  "owlpic.com", "cszbl.com", "spam.la",
  "0-mail.com", "0815.ru", "0815.su", "0815.ry",
  "mt2014.com", "mt2015.com",
  "getnada.com", "sharklasers.com",
  "luxusmail.org", "luxusmail.uk", "luxusmail.gq",
  "emlpro.com", "emltmp.com", "emlhub.com",
  "inboxbear.com", "inemail.in", "nwytg.net",
  "mohmal.com", "mohmal.in",
  "anonbox.net", "anonmails.de",
  "emailondeck.com", "superrito.com",
  "spamwc.de", "spamwc.cf", "spamwc.ga", "spamwc.ml",
  "getairmail.com", "getairmail.cf", "getairmail.ga", "getairmail.gq", "getairmail.ml",
  "spambox.us", "spambox.info",
  "yopmail.net",
])

/**
 * Returns true if the email uses a known temporary/disposable domain.
 */
export function isTempEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim()
  if (!domain) return false
  return TEMP_MAIL_DOMAINS.has(domain)
}
