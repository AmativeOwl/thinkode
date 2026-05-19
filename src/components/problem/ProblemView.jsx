import { useState } from 'react'
import AttemptList from "./AttemptList"
import RecentTabs from "./RecentTabs"
import Panel from "../ui/Panel"
import AttemptEditor from "./AttemptEditor"
import useAttempts from '../../hooks/useAttempts'
import "./ProblemView.css"

export default function ProblemView({ problem, recentProblems, onSelectProblem, onBack, onRemoveRecent }) {
    const { attempts, addAttempt } = useAttempts(problem.id)
    const [panelOpen, setPanelOpen] = useState(false)

    return (
        <div className="problem-view">
            <div className="problem-view-header">
                <button onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg> 
                    Back
                </button>
                <div className="problem-title">
                    <h1>{problem.title}</h1>
                </div>
                <span className={`difficulty--${problem.difficulty}`}>{problem.difficulty}</span>
                {/* {problem.url && (
                    <a href={problem.url} target="_blank" rel="noreferrer">
                        LeetCode
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    </a>
                )} */}
            </div>

            <RecentTabs
                recentProblems={recentProblems}
                activeProblemId={problem.id}
                onSelectProblem={onSelectProblem}
                onRemove={onRemoveRecent}
            />

            <div className="panel-icon">
                <button className="panel-trigger" data-tooltip="Attempts" onClick={() => setPanelOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
                <Panel
                    title="Attempts"
                    isOpen={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    tabs={[
                        { id: 'attempts', label: 'Previous Attempts', content: <AttemptList attempts={attempts} /> },
                        { id: 'evolution', label: 'Evolution', content: <p>Coming soon</p> },
                        { id: 'stats', label: 'Stats', content: <p>Coming soon</p> },
                    ]}
                />
            </div>

            <AttemptEditor onSubmit={addAttempt} problemTitle={problem.title} problemUrl={problem.url} />

        </div>
    )
}
