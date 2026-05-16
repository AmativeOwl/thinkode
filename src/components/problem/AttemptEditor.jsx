import { useState } from 'react'
import { getSocraticFeedback } from '../../libs/anthropic.js'
import './AttemptEditor.css'

export default function AttemptEditor({ onSubmit, problemTitle }) {
    const [steps, setSteps] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!steps.trim()) return

        setSubmitting(true)
        setError(null)

        try {
            const feedback = await getSocraticFeedback(problemTitle, steps)
            await onSubmit(steps, feedback)
            setSteps('')
        } catch (err) {
            setError('Something went wrong getting feedback. Please try again.')
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                disabled={submitting}
                placeholder="Write your logic here before coding..."
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={submitting || !steps.trim()}>
                {submitting ? 'Getting feedback...' : 'Submit'}
            </button>
        </form>
    )
}