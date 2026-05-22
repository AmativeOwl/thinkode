import { useState } from 'react'
import { getSocraticFeedback, getHint } from '../../libs/gemini.js'
import './AttemptEditor.css'

export default function AttemptEditor({ onSubmit, onOpenPanel, onLoadingChange, problemTitle, problemUrl }) {
    const [steps, setSteps] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [hint, setHint] = useState(null)
    const [hintLoading, setHintLoading] = useState(false)

    function autoGrow(e) {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!steps.trim()) return

        const captured = steps
        setSteps('')
        setHint(null)
        setSubmitting(true)
        setError(null)
        onOpenPanel()
        onLoadingChange(true)

        try {
            const feedback = await getSocraticFeedback(problemTitle, captured, problemUrl)
            await onSubmit(captured, feedback)
        } catch (err) {
            setError('Something went wrong getting feedback. Please try again.')
            console.error(err)
        } finally {
            setSubmitting(false)
            onLoadingChange(false)
        }
    }

    async function handleHint() {
        if (!steps.trim() || hintLoading) return
        setHintLoading(true)
        setHint(null)
        try {
            const result = await getHint(problemTitle, steps, problemUrl)
            setHint(result)
        } catch (err) {
            setHint('Could not get a hint. Please try again.')
            console.error(err)
        } finally {
            setHintLoading(false)
        }
    }

    return (
        <form className="attempt-editor" onSubmit={handleSubmit}>
            <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                onInput={autoGrow}
                disabled={submitting}
                placeholder="Write your logic here before coding..."
            />
            {hint && <p className="attempt-editor-hint">{hint}</p>}
            {error && <p className="error">{error}</p>}
            <div className="attempt-editor-actions">
                <button
                    type="button"
                    className="attempt-editor-hint-btn"
                    onClick={handleHint}
                    disabled={submitting || hintLoading || !steps.trim()}
                >
                    {hintLoading ? 'Getting hint...' : 'Hint'}
                </button>
                <button type="submit" className="attempt-editor-submit" disabled={submitting || !steps.trim()}>
                    {submitting ? 'Getting feedback...' : 'Submit'}
                </button>
            </div>
        </form>
    )
}
