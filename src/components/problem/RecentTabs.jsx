import "./RecentTabs.css"

export default function RecentTabs({ recentProblems, activeProblemId, onSelectProblem }) {
    if (recentProblems.length === 0) return null
    
    return (
        // Displays a horizontal list of recently viewed problems, allowing users to quickly switch between them without going back to the StartPage.
        <div className="recent-tabs">
            {recentProblems.map(p => (
                <button
                    key={p.id}
                    className={`recent-tab ${p.id === activeProblemId ? 'active' : ''}`}
                    onClick={() => onSelectProblem(p.id)}
                >
                    {p.title}
                </button>
            ))}
        </div>
    )
}