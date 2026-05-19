import "./RecentTabs.css"

export default function RecentTabs({ recentProblems, activeProblemId, onSelectProblem, onRemove }) {
    if (recentProblems.length === 0) return null

    return (
        <div className="recent-tabs">
            {recentProblems.map(p => (
                <div key={p.id} className={`recent-tab ${p.id === activeProblemId ? 'active' : ''}`}>
                    <button className="recent-tab-title" onClick={() => onSelectProblem(p.id)}>
                        {p.title}
                    </button>
                    <button
                        className="recent-tab-close"
                        onClick={e => { e.stopPropagation(); onRemove(p.id) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            ))}
        </div>
    )
}
