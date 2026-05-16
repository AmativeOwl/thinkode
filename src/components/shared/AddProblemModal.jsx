import { useState } from 'react'
import "./AddProblemModal.css"

export default function AddProblemModal({ onClose, onAdd }) {
    const [title, setTitle] = useState('')
    const [difficulty, setDifficulty] = useState('easy')
    const [url, setUrl] = useState('')

    function handleSubmit() {
        if (!title.trim()) return
        onAdd({ title: title.trim(), difficulty, url: url.trim() || null })
    }

    // Provides a modal form for adding a new problem to the list, including inputs for title, difficulty and an optional URL to Leetcode. 
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Add Problem</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                    <input
                        type="text"
                        placeholder="Problem title e.g. Two Sum"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <input
                        type="url"
                        placeholder="LeetCode URL (optional)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}