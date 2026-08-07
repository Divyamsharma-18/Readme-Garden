
import { isDisposableEmailDomain, disposableEmailBlocklistSet } from "disposable-email-domains-js"
import { z } from "zod"

// ─── Zod email schema ────────────────────────────────────────────────────────

const emailSchema = z.string().email()

/**
 * Returns true when the string is a syntactically valid email address.
 * Handles plus-addressing transparently (user+tag@domain.com → valid).
 */
export function isValidEmailSyntax(email: string): boolean {
  return emailSchema.safeParse(email).success
}

// ─── Supplemental blocklist ──────────────────────────────────────────────────
// Domains confirmed disposable that the primary package misses.

const SUPPLEMENTAL_BLOCKLIST = new Set([
  // Temp-mail family
  "tempmail.com", "tempmail.net", "tempmail.org", "temp-mail.org", "temp-mail.io",
  "tempr.email", "temp.email", "tempemail.com", "temporaryemail.com", "temporary-mail.com",
  "tempmailo.com",
  // Yopmail family
  "yopmail.com", "yopmail.fr", "yopmail.net",
  "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc", "nomail.xl.cx",
  "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
  // Trashmail
  "trashmail.com", "trashmail.me", "trashmail.net", "trashmail.io",
  "trashmail.at", "trashmail.org", "trashmail.de",
  // Throwaway / discard
  "throwaway.email", "throwam.com", "throwam.net",
  "discard.email", "discardmail.com", "discardmail.de",
  // 10-minute mail extras
  "10minemail.com",
  // Nada / burner
  "nada.email", "nada.ltd", "getnada.com", "burnermail.io",
  // Misc confirmed gaps
  "maildrop.cc", "mailnull.com", "mailscrap.com", "mailexpire.com",
  "fakemail.net", "fakeinbox.com", "fakemailgenerator.com",
  "spambox.us", "spambox.info", "spaml.com", "spam.la", "spam4.me",
  "nwytg.net", "inboxbear.com", "mohmal.com", "mohmal.in",
  "anonbox.net", "anonmails.de", "emailondeck.com",
  "luxusmail.org", "luxusmail.uk", "luxusmail.gq",
  "emlpro.com", "emltmp.com", "emlhub.com",
  "owlpic.com", "bccto.me", "chacuo.net",
  "spamfree24.org", "spamfree24.de", "spamfree24.eu",
  "filzmail.com", "filzmail.de",
  "0-mail.com", "0815.ru", "0815.su", "0815.ry",
  "mt2014.com", "mt2015.com",
  "superrito.com", "getairmail.com",
])

// Pre-built Set from the primary package (loaded once at module initialisation).
const PRIMARY_BLOCKLIST: Set<string> = disposableEmailBlocklistSet()

// ─── Public-suffix guard ─────────────────────────────────────────────────────
// We never want to flag bare TLDs or 2-part public suffixes as disposable.
// Anything with fewer than 2 labels (or exactly 2 labels where the right part
// is a well-known ccTLD second-level like co.uk) is a public suffix, not a domain.

const MULTI_PART_PUBLIC_SUFFIXES = new Set([
  "co.uk", "co.in", "co.nz", "co.za", "co.jp", "co.kr",
  "com.au", "com.br", "com.ar", "com.mx", "com.sg", "com.hk",
  "org.uk", "me.uk", "net.uk", "ac.uk", "gov.uk", "edu.au",
  "net.au", "org.au", "gov.au",
])

function isPublicSuffix(candidate: string): boolean {
  const parts = candidate.split(".")
  // Single label (e.g. "com") is always a public suffix
  if (parts.length < 2) return true
  // Two labels that match a known multi-part public suffix (e.g. "co.uk")
  if (parts.length === 2 && MULTI_PART_PUBLIC_SUFFIXES.has(candidate)) return true
  return false
}

// ─── Core detection ──────────────────────────────────────────────────────────

/**
 * Checks whether a domain (already normalised to lowercase) is on the
 * disposable blocklist, walking up the domain tree for subdomain detection.
 *
 * Examples:
 *   "mailinator.com"          → true  (exact match)
 *   "sub.mailinator.com"      → true  (parent "mailinator.com" matches)
 *   "gmail.com"               → false
 *   "custom-startup.co.uk"    → false
 */
function isDomainDisposable(domain: string): boolean {
  const parts = domain.split(".")

  // Walk from the full domain up to (but not including) public suffixes.
  // e.g. "a.b.mailinator.com" checks: "a.b.mailinator.com", "b.mailinator.com", "mailinator.com"
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join(".")
    if (isPublicSuffix(candidate)) break
    if (PRIMARY_BLOCKLIST.has(candidate) || SUPPLEMENTAL_BLOCKLIST.has(candidate)) return true
    // Also use the package's own checker (handles its own normalisation)
    if (isDisposableEmailDomain(candidate)) return true
  }

  return false
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface EmailValidationResult {
  valid: boolean
  /** Normalised (trimmed, lowercased, plus-address preserved) email. */
  normalised: string
  error?: "INVALID_SYNTAX" | "DISPOSABLE_EMAIL"
}

/**
 * Full email validation pipeline:
 * 1. Trim + lowercase
 * 2. Syntax check (Zod)
 * 3. Domain extraction (safe, handles plus-addressing)
 * 4. Disposable domain detection with subdomain traversal
 *
 * @param raw - The raw email string from user input.
 * @param options.checkDisposable - Set to false to skip disposable check (e.g. sign-in). Default true.
 */
export function validateEmail(
  raw: string,
  options: { checkDisposable?: boolean } = {},
): EmailValidationResult {
  const { checkDisposable = true } = options

  // Step 1 – normalise
  const normalised = raw.trim().toLowerCase()

  // Step 2 – syntax
  if (!isValidEmailSyntax(normalised)) {
    return { valid: false, normalised, error: "INVALID_SYNTAX" }
  }

  // Step 3 – domain extraction
  // Safe: Zod already confirmed the email is valid so "@" is guaranteed.
  // We use the part after the last "@" to handle edge cases.
  // Plus-addressing: user+tag@domain.com → domain is still "domain.com"
  const domain = normalised.split("@").at(-1)!

  // Step 4 – disposable check (signup only)
  if (checkDisposable && isDomainDisposable(domain)) {
    return { valid: false, normalised, error: "DISPOSABLE_EMAIL" }
  }

  return { valid: true, normalised }
}

/**
 * Convenience wrapper — returns true when the email is from a known
 * disposable/temporary domain after full normalisation.
 * Intended for client-side (UI) use where only the boolean matters.
 */
export function isDisposableEmail(raw: string): boolean {
  return validateEmail(raw).error === "DISPOSABLE_EMAIL"
}

/** Human-readable error messages keyed by validation error code. */
export const EMAIL_VALIDATION_ERRORS = {
  INVALID_SYNTAX: "Please enter a valid email address.",
  DISPOSABLE_EMAIL:
    "Temporary or disposable email addresses are not supported. Please use a permanent email address.",
} as const
