import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// --------------------------------------------------------
//  PASTE YOUR DEMO VIDEO LINK HERE WHEN READY
// --------------------------------------------------------
const DEMO_VIDEO_URL = ''

export default function HomeView({ t, lang }) {
  const navigate = useNavigate()
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      {/* ============================================================
       *  HERO
       * ============================================================ */}
      <header
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(120% 140% at 78% 15%, #2c5540 0%, #1E3B2C 46%, #142a1e 100%)',
          color: 'var(--cream)',
        }}
      >
        <div className="hero-grid">
          {/* Left column */}
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-7"
              style={{
                background: 'rgba(216,179,74,0.14)',
                border: '1px solid rgba(216,179,74,0.35)',
                color: 'var(--gold)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--tomato)' }}
              />
              SIH 2026 · PS 26128
            </span>

            <h1
              className="font-bold"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(40px, 6vw, 68px)',
                fontWeight: 600,
                lineHeight: 1.03,
                letterSpacing: '-0.01em',
              }}
            >
              Catching livestock
              <br />
              disease{' '}
              <em style={{ fontStyle: 'normal', color: 'var(--green-soft)' }}>
                before
              </em>
              <br />
              it spreads.
            </h1>

            <p
              className="mt-6"
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: 'rgba(247,242,231,0.78)',
                maxWidth: 480,
              }}
            >
              Pandora Livestock Intelligence pairs an on-field AI
              triage with weather-aware risk scoring and a veterinary
              review layer — so livestock owners get answers that are
              checked, not just guessed.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => navigate('/farmer')}
              >
                Enter the Prototype
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href="#portal"
                className="text-[15px] font-semibold transition-colors"
                style={{
                  color: 'var(--cream)',
                  borderBottom: '1px solid rgba(247,242,231,0.35)',
                  paddingBottom: 2,
                }}
              >
                Choose your gate ↓
              </a>
            </div>
          </div>

          {/* Right column — animated cow illustration + stat chips */}
          <div className="hero-art">
            <div
              className="stat-chip chip-1"
              style={{
                background: 'rgba(30,59,44,0.9)',
                border: '1px solid rgba(216,179,74,0.3)',
              }}
            >
              <div className="num">4</div>
              <div className="lbl">livestock conditions detected</div>
            </div>

            <svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="200" cy="432" rx="150" ry="14" fill="#142a1e" opacity="0.6" />

              <g className="cow-grass">
                <path d="M60 425 q4 -18 8 0" stroke="#4E7A57" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M75 428 q5 -22 10 0" stroke="#547C5A" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M320 428 q5 -20 10 0" stroke="#4E7A57" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M338 425 q4 -16 8 0" stroke="#547C5A" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              <g className="cow-group">
                <rect x="245" y="360" width="18" height="68" rx="6" fill="#6E4630" />
                <rect x="270" y="360" width="18" height="68" rx="6" fill="#8B5A3C" />

                <g className="cow-tail" style={{ transformOrigin: '305px 250px' }}>
                  <path
                    d="M305 250 Q330 280 335 320 Q338 345 330 360"
                    stroke="#6E4630"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <ellipse cx="330" cy="366" rx="10" ry="12" fill="#4A3526" />
                </g>

                <path
                  d="M110 240
                     Q105 210 140 200
                     L270 200
                     Q310 205 310 240
                     L310 320
                     Q310 360 270 362
                     L145 362
                     Q110 358 108 320
                     Z"
                  fill="#C9A685"
                />

                <ellipse cx="180" cy="255" rx="24" ry="18" fill="#8B5A3C" opacity="0.55" />
                <ellipse cx="255" cy="300" rx="20" ry="15" fill="#6E4630" opacity="0.45" />
                <ellipse cx="150" cy="320" rx="16" ry="12" fill="#8B5A3C" opacity="0.4" />

                <rect x="130" y="360" width="18" height="68" rx="6" fill="#8B5A3C" />
                <rect x="155" y="360" width="18" height="68" rx="6" fill="#C9A685" />

                <path
                  d="M115 210 L80 190 L70 235 L110 250 Z"
                  fill="#C9A685"
                />

                <g>
                  <g className="cow-ear" style={{ transformOrigin: '95px 175px' }}>
                    <ellipse cx="92" cy="172" rx="14" ry="8" fill="#A97553" transform="rotate(-30 92 172)" />
                  </g>

                  <path d="M82 160 Q76 140 88 132" stroke="#EFE7D6" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M105 155 Q112 138 122 138" stroke="#EFE7D6" strokeWidth="4" fill="none" strokeLinecap="round" />

                  <ellipse cx="95" cy="190" rx="38" ry="34" fill="#C9A685" />

                  <ellipse cx="70" cy="205" rx="22" ry="16" fill="#E8D4BE" />
                  <ellipse cx="60" cy="200" rx="3" ry="4" fill="#4A3526" />
                  <ellipse cx="62" cy="212" rx="3" ry="4" fill="#4A3526" />

                  <g className="cow-eye">
                    <circle cx="108" cy="185" r="4.5" fill="#1E3B2C" />
                    <circle cx="109.5" cy="184" r="1.5" fill="#F7F2E7" />
                  </g>
                </g>
              </g>
            </svg>

            <div
              className="stat-chip chip-2"
              style={{
                background: 'rgba(30,59,44,0.9)',
                border: '1px solid rgba(216,179,74,0.3)',
              }}
            >
              <div className="num">40%</div>
              <div className="lbl">of prototype built so far</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setVideoOpen(true)}
          className="demo-card"
          aria-label="Watch demo video"
        >
          <span className="demo-thumb">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#F7F2E7" />
              <path d="M10 8.3l6.5 3.7-6.5 3.7v-7.4Z" fill="#1E3B2C" />
            </svg>
          </span>
          <span className="demo-text">
            <span className="demo-title">From Photo to Advisory</span>
            <span className="demo-sub">Watch the 2-min demo</span>
          </span>
        </button>

        <svg
          className="block w-full mt-16"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ height: 60 }}
        >
          <path
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,50 L1440,90 L0,90 Z"
            fill="#F7F2E7"
          />
        </svg>
      </header>

      {/* ============================================================
       *  TRUST STRIP
       * ============================================================ */}
      <div
        className="py-6 border-b"
        style={{ background: 'var(--cream)', borderColor: 'var(--cream-dim)' }}
      >
        <div className="wrap">
          <div
            className="flex flex-wrap gap-x-10 gap-y-3 justify-center items-center text-[13px] tracking-wide"
            style={{ color: 'var(--soil)', opacity: 0.72 }}
          >
            <span>Weather data — Open-Meteo</span>
            <span>Advisory grounded in ICAR-NIVEDI &amp; IVRI sources</span>
            <span>Confidence-aware AI — escalates when unsure</span>
            <span>Built for Maharashtra livestock owners</span>
          </div>
        </div>
      </div>

      {/* ============================================================
       *  PORTAL / SIGNPOST SECTION
       * ============================================================ */}
      <section id="portal" className="py-24 md:py-28" style={{ background: 'var(--cream)' }}>
        <div className="wrap">
          <div className="max-w-[600px] mx-auto mb-16 text-center">
            <span className="section-kicker">Choose your gate</span>
            <h2
              className="font-bold"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(30px, 4vw, 44px)',
                color: 'var(--soil)',
              }}
            >
              Three ways into the field
            </h2>
            <p
              className="mt-4"
              style={{ fontSize: 16, color: '#6b5c4c', lineHeight: 1.6 }}
            >
              The prototype branches by who's holding the phone. Pick
              the one you want to walk through — each leads to a
              different view of the same livestock health data.
            </p>
          </div>

          <div className="portal-signpost">
            <PortalCard
              to="/farmer"
              icon="farmer"
              title="Owner"
              desc="Snap an animal photo, get a condition check, a risk score, and a plain-language advisory — in the field, in seconds."
              cta="Open owner view"
            />
            <PortalCard
              to="/officer"
              icon="officer"
              title="Vet Officer"
              desc="Review cases the system escalated, confirm or correct them, and feed the outcome back into the system."
              cta="Open officer view"
            />
            <PortalCard
              to="/map"
              icon="hotspot"
              title="Hotspot Map"
              desc="See where livestock disease cases are clustering across the region, weighted by weather-driven risk, updated as reports come in."
              cta="Open hotspot map"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
       *  HOW IT WORKS — 5 steps
       * ============================================================ */}
      <section
        id="how"
        className="py-24"
        style={{ background: 'var(--soil)', color: 'var(--cream)' }}
      >
        <div className="wrap">
          <div className="max-w-[520px] mb-14">
            <span
              className="font-semibold text-sm"
              style={{ color: 'var(--gold)' }}
            >
              How it works
            </span>
            <h2
              className="mt-3"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: 'var(--cream)',
              }}
            >
              From photo to advisory in five steps
            </h2>
          </div>

          <div className="flow-steps">
            <FlowStep n="01" title="Photo &amp; Location" desc="Owner uploads an animal photo; location is captured for local weather lookup." />
            <FlowStep n="02" title="AI triage" desc="Classifier reads the animal and returns a condition with a confidence score." />
            <FlowStep n="03" title="Risk scoring" desc="Live weather is matched against disease-specific risk profiles for a 0–100 score." />
            <FlowStep n="04" title="Monitoring" desc="Each report is compared to prior ones from the same holding to detect change over time." />
            <FlowStep n="05" title="Escalate or advise" desc="Confident, low-risk cases get a sourced advisory. Serious cases route to a vet officer for review." />
          </div>
        </div>
      </section>

      {/* ============================================================
       *  ROADMAP — WHAT'S NEXT
       * ============================================================ */}
      <section className="py-24" style={{ background: 'var(--cream)' }}>
        <div className="wrap">
          <div className="max-w-[600px] mx-auto mb-14 text-center">
            <span className="section-kicker">On the roadmap</span>
            <h2
              className="font-bold"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: 'var(--soil)',
              }}
            >
              What's coming next
            </h2>
            <p
              className="mt-4"
              style={{ fontSize: 15, color: '#6b5c4c', lineHeight: 1.6 }}
            >
              The v0.1 prototype covers the full detection-to-advisory
              loop. These additions complete the field workflow — built
              on the same architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <RoadmapCard
              icon="🆔"
              title="Pashu Aadhaar registration"
              desc="Link each animal to the national NDLM ID already carried by 36+ crore livestock."
            />
            <RoadmapCard
              icon="💉"
              title="Vaccination records"
              desc="Track doses, schedules, and next-due dates for FMD, LSD, and HS."
            />
            <RoadmapCard
              icon="🧪"
              title="Sample and lab referral"
              desc="Request a lab test, log results, and attach them to the case history."
            />
            <RoadmapCard
              icon="☎️"
              title="IVR / voice call"
              desc="Report symptoms by phone — for owners without smartphones."
            />
            <RoadmapCard
              icon="🐄"
              title="Herd management"
              desc="Animal-level profiles, milk yield, breeding records, and lifecycle."
            />
            <RoadmapCard
              icon="⚠️"
              title="Zoonotic alerts"
              desc="Dual-track escalation to veterinary and public-health channels."
            />
            <RoadmapCard
              icon="📊"
              title="District dashboards"
              desc="Block-level surveillance views for state animal-husbandry officials."
            />
            <RoadmapCard
              icon="💰"
              title="Insurance claims"
              desc="Share vet-verified diagnosis with insurers to reduce manual verification."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
       *  DEMO VIDEO MODAL
       * ============================================================ */}
      {videoOpen && (
        <div
          className="video-modal-backdrop"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="video-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-close"
              onClick={() => setVideoOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="video-frame">
              <VideoFrame url={DEMO_VIDEO_URL} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
 *  PORTAL CARD
 * ============================================================ */

function PortalCard({ to, icon, title, desc, cta }) {
  const navigate = useNavigate()

  const tint = {
    farmer:  { bg: 'rgba(63,107,74,0.14)',  color: 'var(--green-mid)' },
    officer: { bg: 'rgba(74,53,38,0.12)',   color: 'var(--soil)' },
    hotspot: { bg: 'rgba(193,68,45,0.13)',  color: 'var(--tomato-deep)' },
  }[icon]

  const linkColor = {
    farmer:  'var(--green-mid)',
    officer: 'var(--soil)',
    hotspot: 'var(--tomato-deep)',
  }[icon]

  return (
    <button onClick={() => navigate(to)} className="portal-post">
      <span className="portal-peg" />
      <div
        className="rounded-2xl flex items-center justify-center mb-5"
        style={{ background: tint.bg, color: tint.color, width: 52, height: 52 }}
      >
        <PortalIcon name={icon} />
      </div>
      <h3
        className="text-xl mb-2.5"
        style={{ fontFamily: 'Fraunces, serif', color: 'var(--soil)' }}
      >
        {title}
      </h3>
      <p
        className="text-[14.5px] leading-relaxed mb-5"
        style={{ color: '#6b5c4c', minHeight: 66 }}
      >
        {desc}
      </p>
      <span
        className="inline-flex items-center gap-2 font-semibold text-sm pb-0.5"
        style={{ color: linkColor, borderBottom: `1px solid ${linkColor}` }}
      >
        {cta}
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}

function PortalIcon({ name }) {
  if (name === 'farmer') {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M12 21c4-3 7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 3 8 7 11Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  if (name === 'officer') {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
      <path d="M12 21s7-7.1 7-12a7 7 0 1 0-14 0c0 4.9 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/* ============================================================
 *  FLOW STEP
 * ============================================================ */

function FlowStep({ n, title, desc }) {
  return (
    <div className="pl-4" style={{ borderLeft: '2px solid rgba(216,179,74,0.4)' }}>
      <div
        className="mb-2.5"
        style={{ fontFamily: 'Fraunces, serif', fontSize: 15, color: 'var(--gold)' }}
        dangerouslySetInnerHTML={{ __html: n }}
      />
      <h4
        className="font-semibold mb-2"
        style={{ fontSize: 16, color: 'var(--cream)' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p
        style={{ fontSize: 13.5, color: 'rgba(247,242,231,0.65)', lineHeight: 1.55 }}
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </div>
  )
}

/* ============================================================
 *  ROADMAP CARD
 * ============================================================ */

function RoadmapCard({ icon, title, desc }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{
        background: '#ffffff',
        border: '1px solid var(--cream-dim)',
        boxShadow: '0 1px 2px rgba(30, 59, 44, 0.03)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(216,179,74,0.18)',
            color: 'var(--tomato-deep)',
          }}
        >
          Coming soon
        </span>
      </div>
      <h4
        className="font-semibold mb-2"
        style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 15,
          color: 'var(--soil)',
        }}
      >
        {title}
      </h4>
      <p
        className="text-xs leading-relaxed"
        style={{ color: 'rgba(74,53,38,0.7)' }}
      >
        {desc}
      </p>
    </div>
  )
}

/* ============================================================
 *  VIDEO FRAME RENDERER
 * ============================================================ */

function VideoFrame({ url }) {
  if (!url) {
    return (
      <div className="video-placeholder">
        <svg viewBox="0 0 24 24" fill="none" width="34" height="34">
          <path d="M23 7l-7 5 7 5V7Z" stroke="#F7F2E7" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="1" y="5" width="15" height="14" rx="2" stroke="#F7F2E7" strokeWidth="1.6" />
        </svg>
        <p>Demo video coming soon</p>
        <span>
          The full walkthrough — animal photo, AI triage, vet review,
          hotspot map — will appear here.
        </span>
      </div>
    )
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/
  )

  if (ytMatch) {
    const videoId = ytMatch[1]
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Pandora Livestock demo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0 }}
      />
    )
  }

  return (
    <video controls autoPlay playsInline style={{ width: '100%', height: '100%' }}>
      <source src={url} type="video/mp4" />
    </video>
  )
}