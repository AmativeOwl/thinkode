import ExampleTabs from './ExampleTabs'
import './AttemptCard.css'

export default function AttemptCard({ attempt, index }) {
    const formattedDate = new Date(attempt.created_at).toLocaleDateString()
    const examples = attempt.examples ?? []

    // displays the details of a single attempt, including the steps taken and any feedback received with additional of example tabs
    return (
        <div className="attempt-card">
            <div className="attempt-card-header">
                <span>Attempt {index} - </span>
                <span>{formattedDate}</span>
            </div>

            <ExampleTabs examples={examples} />

            <div className="attempt-card-steps">
                <pre>{attempt.steps}</pre>
            </div>
            {attempt.feedback && (
                <div className="attempt-card-feedback">
                    <div className="speech-bubble">
                        {attempt.feedback}
                    </div>
                </div>
            )}
        </div>
    )
}
