import { useState } from 'react'
import Pillar from "../ui/Pillar"
import Socrates from "../ui/Socrates"
import AddProblemModal from "../shared/AddProblemModal"
import "./StartPage.css"

export default function StartPage({ problems, onSelectProblem, onAddProblem, onEditProblem, onDeleteProblem }) {
    const [search, setSearch] = useState('')
    const [difficulty, setDifficulty] = useState('all')
    const [editingProblem, setEditingProblem] = useState(null)
    const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)

    // Filters both by difficulty and case-insensitive title
    const filtered = problems
        .filter(p => difficulty === 'all' || p.difficulty === difficulty)
        .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
        <div className="start-layout">
            <Pillar />

            <div className="start-page">
                <h1>Thinkode</h1>
                <p>Welcome to Thinkode! Please select a problem to get started.</p>

                <div className="start-header">
                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={onAddProblem}>+ Add Problem</button>
                </div>

                <div className="filter">
                    {['all', 'easy', 'medium', 'hard'].map(d => (
                        <button
                            key={d}
                            className={`chip ${difficulty === d ? 'active' : ''}`}
                            onClick={() => setDifficulty(d)}
                        >
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="problem-grid">
                    {filtered.length === 0 && 
                    <>
                        <div className="no-results-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                            <p>No problems found.</p>
                        </div>
                    </>}
                    {filtered.map((problem) => (
                        <div
                            key={problem.id}
                            className="problem-card"
                            onClick={() => onSelectProblem(problem.id)}
                        >
                            <h2>{problem.title}</h2>
                            <span className={`difficulty difficulty--${problem.difficulty}`}>
                                {problem.difficulty}
                            </span>
                            <div className="problem-card-actions" onClick={(e) => e.stopPropagation()}>
                                {confirmingDeleteId === problem.id ? (
                                    <div className="problem-card-confirm">
                                        <span>Delete?</span>
                                        <button className="confirm-yes" onClick={() => { onDeleteProblem(problem.id); setConfirmingDeleteId(null) }}>Yes</button>
                                        <button className="confirm-no" onClick={() => setConfirmingDeleteId(null)}>No</button>
                                    </div>
                                ) : (
                                    <>
                                        <button className="problem-card-edit" onClick={() => setEditingProblem(problem)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                        </button>
                                        <button className="problem-card-delete" onClick={() => setConfirmingDeleteId(problem.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <Socrates />
            </div>

            <Pillar />
        </div>

        {editingProblem && (
            <AddProblemModal
                problems={problems}
                initialValues={editingProblem}
                onClose={() => setEditingProblem(null)}
                onEdit={(fields) => {
                    onEditProblem(editingProblem.id, fields)
                    setEditingProblem(null)
                }}
            />
        )}
    </>
    )
}