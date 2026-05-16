import { useState } from 'react'
import "./StartPage.css"

export default function StartPage({ problems, onSelectProblem, onAddProblem }) {
    const [search, setSearch] = useState('')
    const [difficulty, setDifficulty] = useState('all')

    const filtered = problems
    .filter(p => difficulty === 'all' || p.difficulty === difficulty)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))


  return (
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
            {filtered.map((problem) => (
                <div
                    key={problem.id}
                    className="problem-card"
                    onClick={() => onSelectProblem(problem.id)}
                >
                    <h2>{problem.title}</h2>
                    <span style={{ color: `var(--color-${problem.difficulty})` }}>
                        {problem.difficulty}
                    </span>
                </div>
            ))}
        </div>
    </div>
  )
}