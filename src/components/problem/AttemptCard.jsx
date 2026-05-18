import './AttemptCard.css'

export default function AttemptCard({ attempt, index }) {
    const formattedDate = new Date(attempt.created_at).toLocaleDateString()

    // Displays the details of a single attempt, including the steps taken and any feedback received. 
    return (
        <div className="attempt-card">
            <div className="attempt-card-header">
                <span>Attempt {index} - </span>
                <span>{formattedDate}</span>
            </div>
            <div className="attempt-card-steps">
                <pre>{attempt.steps}</pre>
            </div>
            {attempt.feedback || "What assumptions are you making about the input?" && (
                <div className="attempt-card-feedback">
                    <div className="speech-bubble">
                        {attempt.feedback || "What assumptions are you making about the input?"}
                    </div>
                </div>
            )}
        </div>
    )
}