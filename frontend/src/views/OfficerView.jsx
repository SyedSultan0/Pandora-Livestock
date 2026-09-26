import { useEffect, useState } from 'react'
import {
  getOfficerQueue,
  getHealthReport,
  submitExpertValidation,
} from '../api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorBox from '../components/ErrorBox.jsx'

const DEMO_EXPERT_ID = 1

const VERDICT_OPTIONS = [
  { value: 'CONFIRMED',    label: '✅ Confirmed (agree with AI)' },
  { value: 'CORRECTED',    label: '✏️ Corrected (different condition)' },
  { value: 'REJECTED',     label: '❌ Rejected (AI is wrong)' },
  { value: 'INCONCLUSIVE', label: '❓ Inconclusive (need more info)' },
]

const CONDITION_OPTIONS = [
  'Lumpy Skin Disease',
  'Foot and Mouth Disease',
  'Foot Infection',
  'Healthy',
]

export default function OfficerView({ t, lang }) {

  const [queue, setQueue] = useState([])
  const [loadingQueue, setLoadingQueue] = useState(true)
  const [queueError, setQueueError] = useState(null)

  const [selectedId, setSelectedId] = useState(null)
  const [report, setReport] = useState(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const [reportError, setReportError] = useState(null)

  const [justReviewed, setJustReviewed] = useState([])

  useEffect(() => {
    loadQueue()
  }, [])

  async function loadQueue() {
    setLoadingQueue(true)
    setQueueError(null)
    try {
      const { data } = await getOfficerQueue({ limit: 50 })
      setQueue(data.items || [])
    } catch (err) {
      setQueueError(
        err.response?.data?.detail || err.message || 'Failed to load queue.'
      )
    } finally {
      setLoadingQueue(false)
    }
  }

  async function selectCase(reportId) {
    if (reportId === selectedId) return
    setSelectedId(reportId)
    setReport(null)
    setReportError(null)
    setLoadingReport(true)
    try {
      const { data } = await getHealthReport(reportId)
      setReport(data)
    } catch (err) {
      setReportError(
        err.response?.data?.detail || err.message || 'Failed to load report.'
      )
    } finally {
      setLoadingReport(false)
    }
  }

  function handleReviewed(reportId, verdict) {
    const item = queue.find((q) => q.health_report_id === reportId)
    setQueue((prev) => prev.filter((q) => q.health_report_id !== reportId))
    if (item) {
      setJustReviewed((prev) => [{ ...item, verdict }, ...prev])
    }
    setSelectedId(null)
    setReport(null)
  }

  return (
    <div className="wrap py-8 md:py-12 space-y-6">

      <header>
        <h1
          className="font-bold mb-2"
          style={{ fontFamily: 'Fraunces, serif', fontSize: 32, color: 'var(--soil)' }}
        >
          🩺 {t.navOfficer}
        </h1>
        <p style={{ color: 'rgba(74,53,38,0.7)', fontSize: 15 }}>
          Review escalated livestock cases and submit verdicts. Cases are
          sorted by severity, newest first.
        </p>
      </header>

      <ErrorBox message={queueError} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-1 space-y-3">
          <section className="card p-4">
            <h2
              className="text-xs uppercase tracking-wider font-semibold mb-3"
              style={{ color: 'rgba(74,53,38,0.55)' }}
            >
              {t.pendingQueue || 'Pending queue'}
            </h2>

            {loadingQueue ? (
              <LoadingSpinner label="Loading queue…" />
            ) : queue.length === 0 ? (
              <p className="text-sm" style={{ color: 'rgba(74,53,38,0.55)' }}>
                {t.nothingWaiting || 'Nothing waiting for review. ✓'}
              </p>
            ) : (
              <ul className="space-y-2">
                {queue.map((item) => (
                  <QueueItem
                    key={item.health_report_id}
                    item={item}
                    selected={item.health_report_id === selectedId}
                    onSelect={() => selectCase(item.health_report_id)}
                  />
                ))}
              </ul>
            )}
          </section>

          {justReviewed.length > 0 && (
            <section className="card p-4">
              <h2
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: 'rgba(74,53,38,0.55)' }}
              >
                {t.reviewedSession || 'Reviewed this session'}
              </h2>
              <ul className="space-y-2">
                {justReviewed.map((item) => (
                  <li
                    key={item.health_report_id}
                    className="text-xs flex items-center justify-between"
                    style={{ color: 'rgba(74,53,38,0.7)' }}
                  >
                    <span>#{item.health_report_id} · {item.prediction?.predicted_class}</span>
                    <span style={{ color: 'var(--green-mid)' }}>{item.verdict}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedId ? (
            <div className="card p-8 text-center text-sm" style={{ color: 'rgba(74,53,38,0.55)' }}>
              {t.selectCase || 'Select a case from the queue to review it.'}
            </div>
          ) : loadingReport ? (
            <div className="card p-8">
              <LoadingSpinner label="Loading report…" />
            </div>
          ) : reportError ? (
            <div className="card p-8">
              <ErrorBox message={reportError} />
            </div>
          ) : (
            <ReportDetail
              report={report}
              onReviewed={(verdict) => handleReviewed(selectedId, verdict)}
              t={t}
            />
          )}
        </div>

      </div>
    </div>
  )
}

function QueueItem({ item, selected, onSelect }) {
  const risk = item.risk?.risk_level
  const decision = item.escalation?.decision

  return (
    <li>
      <button
        onClick={onSelect}
        className="w-full text-left rounded-md border px-3 py-2 transition"
        style={{
          borderColor: selected ? 'var(--green-mid)' : 'var(--cream-dim)',
          background: selected ? 'var(--cream)' : '#fff',
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: 'rgba(74,53,38,0.55)' }}>
            #{item.health_report_id}
          </span>
          <span className={'text-xs font-semibold ' + riskText(risk)}>
            {risk}
          </span>
        </div>
        <div className="text-sm font-medium truncate" style={{ color: 'var(--soil)' }}>
          {item.prediction?.predicted_class}
        </div>
        <div className="text-xs mt-1 flex items-center justify-between" style={{ color: 'rgba(74,53,38,0.55)' }}>
          <span>{item.farm?.district || '—'}</span>
          <span style={{ color: 'var(--gold)' }}>
            {decisionLabel(decision)}
          </span>
        </div>
      </button>
    </li>
  )
}

function ReportDetail({ report, onReviewed, t }) {

  const prediction = report.prediction
  const risk = report.risk
  const advisory = report.advisory
  const evidence = advisory?.evidence?.[0]
  const explanation = report.explanation
  const escalation = report.escalation

  const [status, setStatus] = useState('CONFIRMED')
  const [confirmedCondition, setConfirmedCondition] = useState(
    prediction?.predicted_class || ''
  )
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        expert_id: DEMO_EXPERT_ID,
        status,
        comments: comments || null,
      }

      if (status === 'CONFIRMED' || status === 'CORRECTED') {
        payload.confirmed_condition = confirmedCondition
      }

      await submitExpertValidation(report.health_report.id, payload)
      onReviewed(status)
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail || err.message || 'Submission failed.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">

      <section className="card p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs" style={{ color: 'rgba(74,53,38,0.55)' }}>
              Report #{report.health_report?.id}
            </div>
            <div
              className="text-xl font-bold mt-1"
              style={{ fontFamily: 'Fraunces, serif', color: 'var(--soil)' }}
            >
              {prediction?.predicted_class || 'Unknown'}
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(74,53,38,0.6)' }}>
              {report.farm?.farm_name} · {report.farm?.district}
            </div>
          </div>
          {risk && (
            <div className="text-right">
              <div className={'text-lg font-bold ' + riskText(risk.risk_level)}>
                {risk.risk_level}
              </div>
              <div className="text-xs" style={{ color: 'rgba(74,53,38,0.55)' }}>
                {risk.risk_score}/100
              </div>
            </div>
          )}
        </div>

        {escalation && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--cream-dim)' }}>
            <div
              className="text-xs uppercase tracking-wider font-semibold mb-1"
              style={{ color: 'rgba(74,53,38,0.55)' }}
            >
              Escalation
            </div>
            <div className="font-semibold" style={{ color: 'var(--gold)' }}>
              {decisionLabel(escalation.decision)}
            </div>
            {escalation.reasons?.length > 0 && (
              <ul className="text-xs mt-1 space-y-0.5" style={{ color: 'rgba(74,53,38,0.6)' }}>
                {escalation.reasons.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {advisory && (
        <section className="card p-5">
          <h3
            className="text-xs uppercase tracking-wider font-semibold mb-2"
            style={{ color: 'rgba(74,53,38,0.55)' }}
          >
            Advisory
          </h3>
          <p className="text-sm" style={{ color: 'var(--soil)' }}>
            {advisory.advisory_text}
          </p>
          {advisory.sources && (
            <p className="text-xs mt-2" style={{ color: 'rgba(74,53,38,0.55)' }}>
              Source: {advisory.sources.display_source}
            </p>
          )}
        </section>
      )}

      {evidence && (
        <section className="card p-5">
          <h3
            className="text-xs uppercase tracking-wider font-semibold mb-2"
            style={{ color: 'rgba(74,53,38,0.55)' }}
          >
            📚 Evidence
          </h3>
          <p className="text-xs mb-2" style={{ color: 'rgba(74,53,38,0.55)' }}>
            {evidence.document_title}
          </p>
          <p className="text-sm whitespace-pre-line max-h-64 overflow-y-auto" style={{ color: 'rgba(74,53,38,0.85)' }}>
            {evidence.chunk_text}
          </p>
        </section>
      )}

      {explanation?.text && (
        <section className="card p-5">
          <h3
            className="text-xs uppercase tracking-wider font-semibold mb-2"
            style={{ color: 'rgba(74,53,38,0.55)' }}
          >
            💬 Explanation
          </h3>
          <p className="text-sm" style={{ color: 'var(--soil)' }}>
            {explanation.text}
          </p>
        </section>
      )}

      <section
        className="card p-6"
        style={{ borderColor: 'rgba(193, 68, 45, 0.28)', borderWidth: 2 }}
      >
        <h3
          className="text-xs uppercase tracking-wider font-semibold mb-4"
          style={{ color: 'var(--tomato-deep)' }}
        >
          {t.submitVerdict || 'Submit verdict'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <label className="block">
            <span className="label">{t.verdict || 'Verdict'}</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
            >
              {VERDICT_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </label>

          {(status === 'CONFIRMED' || status === 'CORRECTED') && (
            <label className="block">
              <span className="label">
                {status === 'CONFIRMED'
                  ? (t.confirmCondition || 'Confirm the condition')
                  : (t.correctTo || 'Correct to which condition?')}
              </span>
              <select
                value={confirmedCondition}
                onChange={(e) => setConfirmedCondition(e.target.value)}
                className="input"
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="label">{t.comments || 'Comments (optional)'}</span>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder="e.g. Confirmed on field visit."
              className="input"
              style={{ resize: 'vertical', minHeight: 72 }}
            />
          </label>

          <ErrorBox message={submitError} />

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center"
          >
            {submitting ? (t.submitting || 'Submitting…') : (t.submitVerdict || 'Submit verdict')}
          </button>
        </form>
      </section>

    </div>
  )
}

function riskText(level) {
  switch ((level || '').toUpperCase()) {
    case 'LOW':      return 'risk-low'
    case 'MODERATE': return 'risk-moderate'
    case 'HIGH':     return 'risk-high'
    case 'CRITICAL': return 'risk-critical'
    default:         return ''
  }
}

function decisionLabel(decision) {
  switch ((decision || '').toUpperCase()) {
    case 'ROUTINE':       return '⚪ Routine'
    case 'MONITOR':       return '🟡 Monitor'
    case 'ATTENTION':     return '🟠 Attention'
    case 'EXPERT_REVIEW': return '🔴 Expert review'
    default:              return decision || '—'
  }
}