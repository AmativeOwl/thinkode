import AttemptList from "./AttemptList"
import "./ProblemView.css"

export default function ProblemView({ problem, recentProblems, onSelectProblem, onBack }) {
    return (
        <>
            <div className="problem-view">
                <button onClick={onBack}>← Back</button>
                <h1>{problem.title}</h1>
                <p>{problem.description}</p>
            </div>

            <AttemptList attempts={problem.attempts} />

            {recentProblems.length > 0 && (
                <div className="recent-problems">
                    <h2>Recent Problems</h2>
                    <ul>
                        {recentProblems.map(p => (
                            <li key={p.id}>
                                <button onClick={() => onSelectProblem(p.id)}>
                                    {p.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}