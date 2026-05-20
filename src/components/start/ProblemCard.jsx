import { useState } from 'react'
import "./ProblemCard.css"

export default function ProblemCard({ problem, onSelect, onEdit, onDelete }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    return (
        <div
            className="problem-card"
            onClick={() => onSelect(problem.id)}
        >
            <h2>{problem.title}</h2>
            <span className={`difficulty difficulty--${problem.difficulty}`}>
                {problem.difficulty}
            </span>
            <div className="problem-card-actions" onClick={(e) => e.stopPropagation()}>
                {confirmingDelete ? (
                    <div className="problem-card-confirm">
                        <span>Delete?</span>
                        <button className="confirm-yes" onClick={() => { onDelete(problem.id); setConfirmingDelete(false) }}>Yes</button>
                        <button className="confirm-no" onClick={() => setConfirmingDelete(false)}>No</button>
                    </div>
                ) : (
                    <>
                        <button className="problem-card-edit" onClick={() => onEdit(problem)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button className="problem-card-delete" onClick={() => setConfirmingDelete(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
