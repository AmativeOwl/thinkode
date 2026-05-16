export default function AttemptCard({ attempt, index }) {
    const formattedDate = new Date(attempt.created_at).toLocaleDateString()

    // Displays the details of a single attempt, including the steps taken and any feedback received. 
    return (
        <div className="attempt-card">
            <div className="attempt-card__header">
                <span>Attempt {index}</span>
                <span>{formattedDate}</span>
            </div>
            <div className="attempt-card__steps">
                <pre>{attempt.steps}</pre>
            </div>
            {attempt.feedback && (
                <div className="attempt-card__feedback">
                    {attempt.feedback}
                </div>
            )}
        </div>
    )
}