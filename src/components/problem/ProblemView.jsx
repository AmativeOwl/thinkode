import AttemptList from "./AttemptList"
import RecentTabs from "./RecentTabs"
import "./ProblemView.css"

export default function ProblemView({ problem, recentProblems, onSelectProblem, onBack }) {
    return (
        // The main view when a problem is selected. Shows the problem title, difficulty, and a list of attempts. Also includes a sidebar with recently viewed problems for easy navigation.
        <div className="problem-view">
            <div className="problem-view__header">
                <button onClick={onBack}>← Back</button>
                <h1>{problem.title}</h1>
                <span>{problem.difficulty}</span>
                {problem.url && (
                    <a href={problem.url} target="_blank" rel="noreferrer">
                        LeetCode ↗
                    </a>
                )}
            </div>
            
            {/* Displays a horizontal list of recently viewed problems, allowing users to quickly switch between them without going back to the StartPage. It receives the list of recentProblems, the currently active problem ID for styling purposes, and the onSelectProblem callback to update the active problem when a tab is clicked. */}
            <RecentTabs
                recentProblems={recentProblems}
                activeProblemId={problem.id}
                onSelectProblem={onSelectProblem}
            />

            {/* Displays a list of attempts for the currently active problem. It receives the problem object as a prop, which contains all the necessary information to render the attempts. */}
            <AttemptList problem={problem} />
        </div>
    )
}