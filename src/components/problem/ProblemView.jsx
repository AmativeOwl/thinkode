import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import AttemptList from "./AttemptList"
import RecentTabs from "./RecentTabs"
import Panel from "../ui/Panel"
import AttemptEditor from "./AttemptEditor"
import ExamplePanel from "./ExamplePanel"
import useAttempts from '../../hooks/useAttempts'
import useProblemExamples from '../../hooks/useProblemExamples'
import DescriptionImport from './DescriptionImport'
import EvolutionTracker from '../evolution/EvolutionTracker'
import "./ProblemView.css"

export default function ProblemView({ problems, recentProblems, onSelectProblem, onBack, onRemoveRecent }) {
    const { id } = useParams()
    const { attempts, addAttempt } = useAttempts(id)
    const { examples, addExample, updateExample, deleteExample } = useProblemExamples(id)
    const [panelOpen, setPanelOpen] = useState(false)
    const [loadingFeedback, setLoadingFeedback] = useState(false)
    const examplePanelRef = useRef(null)

    // snapshot current examples with each attempt submission for historical record
    async function handleSubmitAttempt(steps, feedback) {
        const snapshot = examples.length
            ? examples.map(e => ({ input: e.input, output: e.output }))
            : null
        await addAttempt(steps, feedback, snapshot)
    }

    const problem = problems.find(p => p.id === id)
    if (!problem) {
        return (
            <div className="problem-view">
                <div className="problem-view-header">
                    <button onClick={onBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 8L2 12L6 16"/>
                            <path d="M2 12H22"/>
                        </svg>
                        Back
                    </button>
                    <div className="problem-title">
                        <h1>Problem not found</h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="problem-view">
            <div className="problem-view-header">
                <button onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8L2 12L6 16"/>
                        <path d="M2 12H22"/>
                    </svg>
                    Back
                </button>
                <div className="problem-title">
                    <h1>{problem.title}</h1>
                </div>
                <span className={`difficulty--${problem.difficulty}`}>{problem.difficulty}</span>
            </div>

            <RecentTabs
                recentProblems={recentProblems}
                activeProblemId={problem.id}
                onSelectProblem={onSelectProblem}
                onRemove={onRemoveRecent}
            />

            {problem.description && <DescriptionImport problemDescription={problem.description} />}

            <div className="panel-icon">
                <button
                    className="panel-trigger"
                    data-tooltip="Add example"
                    onClick={() => examplePanelRef.current?.addExample()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/><path d="M12 5v14"/>
                    </svg>
                </button>
                <button className="panel-trigger" data-tooltip="Attempts" onClick={() => setPanelOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                </button>
                <Panel
                    title="Attempts"
                    isOpen={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    tabs={[
                        { id: 'attempts', label: 'Previous Attempts', content: <AttemptList attempts={attempts} loading={loadingFeedback} /> },
                        { id: 'evolution', label: 'Evolution', content: <p><EvolutionTracker attempts={attempts} /></p> },
                        { id: 'stats', label: 'Stats', content: <p>Coming soon</p> },
                    ]}
                />
            </div>

            <ExamplePanel
                ref={examplePanelRef}
                examples={examples}
                onAdd={addExample}
                onUpdate={updateExample}
                onDelete={deleteExample}
            />

            <AttemptEditor
                key={id}
                onSubmit={handleSubmitAttempt}
                onOpenPanel={() => setPanelOpen(true)}
                onLoadingChange={setLoadingFeedback}
                problemTitle={problem.title}
                problemUrl={problem.url}
            />
        </div>
    )
}
