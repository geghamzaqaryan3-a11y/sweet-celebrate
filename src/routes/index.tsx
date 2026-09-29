import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { invitation } from "@/config/invitation";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: `You're Invited — ${invitation.name}'s Birthday Celebration`,
      },
      {
        name: "description",
        content: `Join us to celebrate ${invitation.name}'s birthday on ${invitation.date} at ${invitation.time}. Let's celebrate this special day together!`,
      },
      {
        property: "og:title",
        content: `You're Invited — ${invitation.name}'s Birthday Celebration`,
      },
      {
        property: "og:description",
        content: "Let's celebrate this special day together.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ── Decorative soft background blobs + sparkles ─────────────────── */

function Decor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blush/60 blur-3xl" />
      <div className="absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-blush/40 blur-3xl" />
      <span className="float-slow absolute top-24 left-8 text-lg text-gold-deep/50">
        ✦
      </span>
      <span
        className="float-slow absolute top-1/2 right-10 text-sm text-blush-deep/40"
        style={{ animationDelay: "1.8s" }}
      >
        ✦
      </span>
      <span
        className="float-slow absolute bottom-32 left-12 text-base text-gold-deep/40"
        style={{ animationDelay: "3.4s" }}
      >
        ✦
      </span>
et    </div>
  );
}

/* ── Section wrapper with scroll reveal ──────────────────────────── */

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className={`reveal px-5 ${className}`}>
      <div className="mx-auto w-full max-w-md">{children}</div>
    </section>
  );
}

/* ── Live countdown ──────────────────────────────────────────────── */

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return { days: null, hours: null, minutes: null, seconds: null, isPast: false };
  }

  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    isPast: diff <= 0,
  };
}

function Countdown() {
  const target = new Date(invitation.eventDateTime);
  const { days, hours, minutes, seconds, isPast } = useCountdown(target);

  if (isPast) {
    return (
      <p className="font-display text-2xl italic text-primary">
        It's party time! 🎉
      </p>
    );
  }

  const cells = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cells.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-border/60 bg-card px-1 py-4 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
            {value === null ? "–" : label === "Days" ? value : pad(value)}
          </div>
          <div className="mt-1 text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── RSVP ────────────────────────────────────────────────────────── */

type Rsvp = { name: string; attending: boolean; savedAt: string };
const RSVP_KEY = "birthday-rsvp";

function RsvpSection() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<Rsvp | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RSVP_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Rsvp;
        setSaved(parsed);
        setName(parsed.name ?? "");
      }
    } catch {
      /* corrupted entry — start fresh */
    }
  }, []);

  const respond = (attending: boolean) => {
    const entry: Rsvp = {
      name: name.trim() || "Guest",
      attending,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(RSVP_KEY, JSON.stringify(entry));
    } catch {
      /* storage unavailable — still show confirmation */
    }
    setSaved(entry);
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
      <h2 className="font-display text-3xl font-semibold text-foreground">
        Will you join us?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Please let us know — it means the world.
      </p>

      <label className="mt-6 block text-xs tracking-[0.18em] text-muted-foreground uppercase">
        Your name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Anna"
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
      />

      {saved ? (
        <div className="mt-6 rounded-2xl bg-secondary px-5 py-4 text-center">
          <p className="font-display text-xl text-secondary-foreground">
            {saved.attending
              ? `Thank you, ${saved.name}! See you there ❤️`
              : `We'll miss you, ${saved.name} 💌`}
          </p>
          <button
            onClick={() => setSaved(null)}
            className="story-link mt-3 text-sm text-muted-foreground"
          >
            Change my answer
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => respond(true)}
            className="rounded-2xl bg-primary px-5 py-3.5 font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
          >
            Yes, I'll be there ❤️
          </button>
          <button
            onClick={() => respond(false)}
            className="rounded-2xl border border-border bg-background px-5 py-3.5 font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:text-secondary-foreground active:translate-y-0"
          >
            Unfortunately, I can't make it
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

function Index() {
  const detailsRef = useReveal<HTMLElement>();
  const heroRef = useReveal<HTMLElement>();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Decor />

      {/* Hero */}
      <section
        ref={heroRef}
        className="reveal is-visible relative flex min-h-[92svh] flex-col items-center justify-center px-6 text-center"
      >
        <p className="hero-enter text-xs tracking-[0.35em] text-gold-deep uppercase">
          A Celebration of {invitation.name}
        </p>
        <h1
          className="hero-enter mt-5 max-w-md font-display text-4xl leading-tight font-semibold text-foreground sm:text-5xl"
          style={{ animationDelay: "0.2s" }}
        >
          {invitation.headline}
        </h1>
        <p
          className="hero-enter mt-4 max-w-sm text-lg font-light text-muted-foreground italic"
          style={{ animationDelay: "0.4s" }}
        >
          {invitation.subtitle}
        </p>

        <div
          className="hero-enter mt-10 flex items-center gap-3 text-gold-deep/70"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="h-px w-10 bg-gold-deep/40" />
          <span className="text-sm">✦</span>
          <span className="h-px w-10 bg-gold-deep/40" />
        </div>

        <a
          href="#details"
          className="hero-enter mt-12 flex flex-col items-center gap-2 text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary"
          style={{ animationDelay: "0.8s" }}
          aria-label="Scroll to event details"
        >
          <span className="tracking-[0.2em] uppercase">Scroll</span>
          <span className="animate-bounce text-lg">↓</span>
        </a>
      </section>

      {/* Event details */}
      <Section id="details" className="pb-6">
        <div
          ref={detailsRef}
          className="reveal rounded-3xl border border-border/60 bg-card p-6 shadow-xl shadow-primary/5 sm:p-8"
        >
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] text-gold-deep uppercase">
              Save the date
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-foreground">
              {invitation.name}'s Birthday
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <DetailRow icon="📅" label="Date" value={invitation.date} />
            <DetailRow icon="🕐" label="Time" value={invitation.time} />
            <DetailRow icon="📍" label="Location" value={invitation.venue} />
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={invitation.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl bg-primary px-6 py-3.5 text-center font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 sm:w-auto"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </Section>

      {/* Countdown */}
      <Section className="py-10">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-gold-deep uppercase">
            Counting down
          </p>
          <p className="mt-3 mb-8 font-display text-2xl font-medium text-foreground italic">
            The big day is almost here
          </p>
          <Countdown />
        </div>
      </Section>

      {/* RSVP */}
      <Section className="py-10">
        <RsvpSection />
      </Section>

      {/* Personal message */}
      <Section className="py-10">
        <div className="text-center">
          <span className="text-2xl text-gold-deep/70">✦</span>
          <p className="mx-auto mt-5 max-w-sm font-display text-2xl leading-relaxed text-foreground italic">
            {invitation.personalMessage}
          </p>
        </div>
      </Section>

      {/* Footer */}
      <footer className="px-6 pt-8 pb-14 text-center">
        <div className="mx-auto flex w-full max-w-md items-center gap-3 text-gold-deep/60">
          <span className="h-px flex-1 bg-gold-deep/25" />
          <span className="text-xs">✦</span>
          <span className="h-px flex-1 bg-gold-deep/25" />
        </div>
        <p className="mt-6 font-display text-lg text-muted-foreground italic">
          {invitation.footer}
        </p>
        <p className="mt-3 text-xs tracking-[0.25em] text-muted-foreground/60 uppercase">
          With love, for {invitation.name}
        </p>
      </footer>
    </main>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush/60 text-lg"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-lg text-foreground">{value}</p>
      </div>
    </div>
  );
}
