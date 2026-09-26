import { useState, useEffect } from 'react'
import {
  createHealthReport,
  getHealthReport,
  scheduleFollowUp,
} from '../api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import SpeakButton from '../components/SpeakButton.jsx'

const DEMO_FARM_ID = 1
const DEMO_CROP_SEASON_ID = 1

const SAMPLE_IMAGES = [
  { key: 'healthy',  file: '/samples/healthy.jpg' },
  { key: 'diseased', file: '/samples/diseased.jpg' },
]

export default function FarmerView({ t, lang }) {

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpNotes, setFollowUpNotes] = useState('')
  const [followUpStatus, setFollowUpStatus] = useState(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  async function loadSample(sample) {
    setError(null)
    setResult(null)
    try {
      const response = await fetch(sample.file)
      if (!response.ok) throw new Error('Sample not available')
      const blob = await response.blob()
      const f = new File([blob], `${sample.key}.jpg`, { type: 'image/jpeg' })
      setFile(f)
    } catch (err) {
      setError('Could not load the sample image. Please try again.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setError('Please choose a photo first.')
      return
    }
    setSubmitting(true)
    setError(null)
    setResult(null)
    setFollowUpStatus(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await createHealthReport(formData, {
        params: {
          farm_id: DEMO_FARM_ID,
          crop_season_id: DEMO_CROP_SEASON_ID,
        },
      })

      const reportId = data.health_report.id
      const { data: fullReport } = await getHealthReport(reportId)
      setResult(fullReport)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Something went wrong during analysis.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleFollowUp(e) {
    e.preventDefault()
    if (!result || !followUpDate) return
    setFollowUpStatus('submitting')
    try {
      await scheduleFollowUp(result.health_report.id, {
        scheduled_date: followUpDate,
        farmer_notes: followUpNotes || null,
      })
      setFollowUpStatus('done')
      setFollowUpDate('')
      setFollowUpNotes('')
    } catch (err) {
      setFollowUpStatus('error')
    }
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError(null)
    setFollowUpStatus(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6">

      <header>
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ fontFamily: 'Fraunces, serif', color: 'var(--soil)' }}
        >
          🐄 {t.farmerHeading}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(74,53,38,0.7)' }}>
          {t.farmerSub}
        </p>
      </header>

      {!result && (
        <form onSubmit={handleSubmit} className="card p-5 md:p-6 space-y-4">

          {/* ---------------- Sample picker ---------------- */}
          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-3"
              style={{ color: 'rgba(74,53,38,0.55)' }}
            >
              {t.trySample || 'Try a sample'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.key}
                  type="button"
                  onClick={() => loadSample(sample)}
                  className="group rounded-xl overflow-hidden transition-all"
                  style={{
                    border: '1px solid var(--cream-dim)',
                    background: 'var(--cream)',
                  }}
                >
                   <img
                    src={sample.file}
                    alt={sample.key}
                    className="w-full h-44 object-cover transition-opacity group-hover:opacity-90"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ---------------- Divider ---------------- */}
          <div className="relative text-center py-1">
            <span
              className="text-xs px-2 relative z-10"
              style={{ color: 'rgba(74,53,38,0.55)', background: '#fff' }}
            >
              {t.orUploadOwn || 'or upload your own'}
            </span>
            <div
              className="absolute top-1/2 left-0 right-0 border-t z-0"
              style={{ borderColor: 'var(--cream-dim)' }}
            ></div>
          </div>

          <label className="block">
            <span
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--soil)' }}
            >
              {t.leafPhoto}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="input-file"
            />
          </label>

          {preview && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--cream-dim)' }}
            >
              <img
                src={preview}
                alt="preview"
                className="max-h-72 w-full object-contain"
                style={{ background: 'var(--cream)' }}
              />
            </div>
          )}

          <ErrorBox message={error} />

          <button
            type="submit"
            disabled={!file || submitting}
            className="btn-primary w-full justify-center"
          >
            {submitting ? t.analyzing : t.analyzeLeaf}
          </button>
        </form>
      )}

      {submitting && (
        <div className="card p-6">
          <LoadingSpinner label={t.analyzing} />
        </div>
      )}

      {result && (
        <ResultCard result={result} onReset={reset} t={t} lang={lang} />
      )}

      {result && (
        <form onSubmit={handleFollowUp} className="card p-5 md:p-6 space-y-3">
          <h2 className="font-semibold" style={{ color: 'var(--soil)' }}>
            📅 {t.scheduleFollowUp}
          </h2>
          <p className="text-xs" style={{ color: 'rgba(74,53,38,0.6)' }}>
            {t.followUpSub}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="label">{t.date}</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="block">
              <span className="label">{t.notesOptional}</span>
              <input
                type="text"
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="e.g. re-check in one week"
                className="input"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={followUpStatus === 'submitting'}
            className="btn-primary"
          >
            {followUpStatus === 'submitting' ? t.submitting : t.scheduleBtn}
          </button>

          {followUpStatus === 'done' && (
            <p className="text-sm" style={{ color: 'var(--green-mid)' }}>
              {t.scheduled}
            </p>
          )}
          {followUpStatus === 'error' && (
            <p className="text-sm" style={{ color: 'var(--tomato)' }}>
              Could not schedule follow-up.
            </p>
          )}
        </form>
      )}

    </div>
  )
}

/* ------------------------------------------------------------------
 *  Result card
 * ------------------------------------------------------------------ */

function ResultCard({ result, onReset, t, lang }) {

  const prediction = result.prediction
  const risk = result.risk
  const advisory = result.advisory
  const evidence = advisory?.evidence?.[0]
  const explanation = result.explanation
  const escalation = result.escalation

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--soil)' }}>
          📋 {t.aiDiagnosis}
        </h2>
        <button
          onClick={onReset}
          className="text-sm hover:underline"
          style={{ color: 'rgba(74,53,38,0.7)' }}
        >
          {t.analyzedOne}
        </button>
      </div>

      {prediction && (
        <section className="card p-5">
          <div className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(74,53,38,0.5)' }}>
            {t.aiDiagnosis}
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: 'Fraunces, serif', color: 'var(--green-mid)' }}
              >
                {prediction.predicted_class}
              </div>
              <div className="text-sm mt-1" style={{ color: 'rgba(74,53,38,0.6)' }}>
                {t.confidence}: {(prediction.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <SpeakButton
              text={`${prediction.predicted_class}. ${t.confidence} ${(prediction.confidence * 100).toFixed(0)} percent.`}
              lang={lang}
            />
          </div>
        </section>
      )}

      {risk && (
        <section className="card p-5">
          <div className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(74,53,38,0.5)' }}>
            {t.environmentalRisk}
          </div>
          <div className="flex items-baseline gap-3">
            <span className={'text-2xl font-bold ' + riskColor(risk.risk_level)}>
              {risk.risk_level}
            </span>
            <span className="text-sm" style={{ color: 'rgba(74,53,38,0.6)' }}>
              {risk.risk_score}/100
            </span>
          </div>
          {risk.factors?.length > 0 && (
            <ul className="mt-3 text-xs space-y-1" style={{ color: 'rgba(74,53,38,0.6)' }}>
              {risk.factors.map((f, i) => (
                <li key={i}>
                  • {f.factor.replace(/_/g, ' ')}:{' '}
                  <span style={{ color: 'var(--green-mid)' }}>+{f.contribution}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

            {advisory && (
        <section className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs uppercase tracking-wide" style={{ color: 'rgba(74,53,38,0.5)' }}>
              {t.whatToDo}
            </div>
            <SpeakButton
              text={
                (advisory.summary || advisory.advisory_text || '') + ' ' +
                (advisory.immediate_actions || []).join(' ')
              }
              lang={lang}
            />
          </div>

          <p className="leading-relaxed mb-4" style={{ color: 'var(--soil)' }}>
            {advisory.summary || advisory.advisory_text}
          </p>

          {advisory.immediate_actions?.length > 0 && (
            <div className="mb-3">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-1.5"
                style={{ color: 'var(--tomato-deep)' }}
              >
                Immediate actions
              </div>
              <ul className="text-sm space-y-1" style={{ color: 'var(--soil)' }}>
                {advisory.immediate_actions.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>
          )}

          {advisory.prevention?.length > 0 && (
            <div className="mb-3">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-1.5"
                style={{ color: 'var(--green-mid)' }}
              >
                Prevention
              </div>
              <ul className="text-sm space-y-1" style={{ color: 'var(--soil)' }}>
                {advisory.prevention.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>
          )}

          {advisory.monitoring?.length > 0 && (
            <div className="mb-3">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-1.5"
                style={{ color: 'var(--gold)' }}
              >
                Monitoring
              </div>
              <ul className="text-sm space-y-1" style={{ color: 'var(--soil)' }}>
                {advisory.monitoring.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          )}

          {advisory.expert_referral && (
            <div
              className="text-xs px-3 py-2 rounded-lg inline-block mb-3"
              style={{
                background: 'rgba(193,68,45,0.12)',
                color: 'var(--tomato-deep)',
              }}
            >
              ⚠️ Expert referral recommended
            </div>
          )}

          {advisory.sources && (
            <p
              className="text-xs mt-3 pt-3"
              style={{
                color: 'rgba(74,53,38,0.5)',
                borderTop: '1px solid var(--cream-dim)',
              }}
            >
              {t.source}: {advisory.sources.display_source}
            </p>
          )}
        </section>
      )}

      {evidence && (
        <section className="card p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="text-xs uppercase tracking-wide" style={{ color: 'rgba(74,53,38,0.5)' }}>
              📚 {t.evidence}
            </div>
            <SpeakButton text={evidence.chunk_text} lang={lang} size="sm" />
          </div>
          <p className="text-xs mb-2" style={{ color: 'rgba(74,53,38,0.55)' }}>
            {evidence.document_title}
          </p>
          <p className="text-sm whitespace-pre-line" style={{ color: 'rgba(74,53,38,0.85)' }}>
            {evidence.chunk_text}
          </p>
        </section>
      )}

      {explanation?.text && (
        <section className="card p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="text-xs uppercase tracking-wide" style={{ color: 'rgba(74,53,38,0.5)' }}>
              💬 {t.explanation}
            </div>
            <SpeakButton text={explanation.text} lang={lang} />
          </div>
          <p className="leading-relaxed" style={{ color: 'var(--soil)' }}>
            {explanation.text}
          </p>
          <p className="text-xs mt-2" style={{ color: 'rgba(74,53,38,0.4)' }}>
            {t.via} {explanation.provider}
          </p>
        </section>
      )}

      {escalation && (
        <section className="card p-5">
          <div className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(74,53,38,0.5)' }}>
            {t.escalation}
          </div>
          <div className="font-semibold mb-2" style={{ color: 'var(--soil)' }}>
            {escalationBadge(escalation.decision)}
          </div>
          {escalation.reasons?.length > 0 && (
            <ul className="text-xs space-y-1" style={{ color: 'rgba(74,53,38,0.6)' }}>
              {escalation.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          )}
        </section>
      )}

    </div>
  )
}

function riskColor(level) {
  switch ((level || '').toUpperCase()) {
    case 'LOW':      return 'risk-low'
    case 'MODERATE': return 'risk-moderate'
    case 'HIGH':     return 'risk-high'
    case 'CRITICAL': return 'risk-critical'
    default:         return ''
  }
}

function escalationBadge(decision) {
  switch ((decision || '').toUpperCase()) {
    case 'ROUTINE':       return '⚪ Routine'
    case 'MONITOR':       return '🟡 Monitor'
    case 'ATTENTION':     return '🟠 Attention'
    case 'EXPERT_REVIEW': return '🔴 Expert review'
    default:              return decision
  }
}