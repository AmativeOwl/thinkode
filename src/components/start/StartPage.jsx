import { useState } from 'react'
import Pillar from "../ui/Pillar"
import Socrates from "../ui/Socrates"
import AddProblemModal from "../shared/AddProblemModal"
import ProblemCard from "./ProblemCard"
import "./StartPage.css"

export default function StartPage({ problems, onSelectProblem, onAddProblem, onEditProblem, onDeleteProblem }) {
    const [search, setSearch] = useState('')
    const [difficulty, setDifficulty] = useState('all')
    const [editingProblem, setEditingProblem] = useState(null)

    // filters both by difficulty and case-insensitive title
    const filtered = problems
        .filter(p => difficulty === 'all' || p.difficulty === difficulty)
        .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

    // renders the start page with a search bar, difficulty filter and a grid of problem cards
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
                        <ProblemCard key={problem.id} problem={problem} onSelect={onSelectProblem} onEdit={setEditingProblem} onDelete={onDeleteProblem} />
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