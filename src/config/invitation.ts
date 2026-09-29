/**
 * ─────────────────────────────────────────────────────────────
 *  ✏️  EDIT EVERYTHING HERE
 *
 *  All the party details live in this one file. Change the
 *  values below and the whole invitation updates.
 * ─────────────────────────────────────────────────────────────
 */
export const invitation = {
  /** Birthday person's first name */
  name: "Anna",

  /** Hero heading */
  headline: "You're Invited to My Birthday Celebration 🎂",

  /** Hero subtitle */
  subtitle: "Let's celebrate this special day together",

  /** Date shown on the card */
  date: "Saturday, November 14, 2026",

  /** Time shown on the card */
  time: "18:00",

  /** Venue / location shown on the card */
  venue: "Rose Garden Terrace, Yerevan",

  /** Google Maps link opened by the "Open in Google Maps" button */
  mapsUrl: "https://maps.google.com/?q=Yerevan",

  /**
   * The real moment of the party — used by the live countdown.
   * Format: YYYY-MM-DDTHH:MM:SS (24h clock)
   */
  eventDateTime: "2026-11-14T18:00:00",

  /** Personal message section */
  personalMessage:
    "Your presence is the best gift we could ask for. We can't wait to celebrate with you! ❤️",

  /** Footer line */
  footer: "Can't wait to celebrate with you!",
} as const;
