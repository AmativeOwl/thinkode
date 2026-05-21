import { useState } from 'react'
import { getSocraticFeedback } from '../../libs/gemini.js'
import './AttemptEditor.css'

export default function AttemptEditor({ onSubmit, onOpenPanel, onLoadingChange, problemTitle, problemUrl }) {
    // handles user input, submission states and error handling
    const [steps, setSteps] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // ensures that the textarea grows in height as more content fills
    function autoGrow(e) {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    // retrieves Socratic feedback from Gemini based on the user's input steps 
    async function handleSubmit(e) {
        e.preventDefault()
        if (!steps.trim()) return

        const captured = steps
        setSteps('')
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

    // renders the attempt editor with a textarea for input and a submit button with error handling
    return (
        <form className="attempt-editor" onSubmit={handleSubmit}>
            <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                onInput={autoGrow}
                disabled={submitting}
                placeholder="Write your logic here before coding..."
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="attempt-editor-submit" disabled={submitting || !steps.trim()}>
                {submitting ? 'Getting feedback...' : 'Submit'}
            </button>
        </form>
    )
}
