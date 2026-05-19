import { useState } from 'react'
import "./AddProblemModal.css"

export default function AddProblemModal({ onClose, onAdd, onEdit, problems = [], initialValues = null }) {
    const isEditing = !!initialValues

    const [title, setTitle] = useState(initialValues?.title ?? '')
    const [difficulty, setDifficulty] = useState(initialValues?.difficulty ?? 'easy')
    const [url, setUrl] = useState(initialValues?.url ?? '')
    const [description, setDescription] = useState(initialValues?.description ?? '')
    const [submitted, setSubmitted] = useState(false)

    const trimmed = title.trim()
    const isEmpty = !trimmed
    const isDuplicate = !isEmpty && problems.some(p =>
        p.title.toLowerCase() === trimmed.toLowerCase() && p.title !== initialValues?.title
    )

    function handleSubmit() {
        setSubmitted(true)
        if (isEmpty || isDuplicate) return
        const fields = { title: trimmed, difficulty, url: url.trim() || null, description: description.trim() || null }
        if (isEditing) onEdit(fields)
        else onAdd(fields)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditing ? 'Edit Problem' : 'Add Problem'}</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                    <input
                        type="text"
                        placeholder="Problem title e.g. Two Sum"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={submitted && (isEmpty || isDuplicate) ? 'input--error' : ''}
                    />
                    {submitted && isEmpty && <p className="field-error">Title is required.</p>}
                    {submitted && isDuplicate && <p className="field-error">A problem with this title already exists.</p>}

                    <div className="difficulty-picker">
                        {['easy', 'medium', 'hard'].map(level => (
                            <button
                                key={level}
                                type="button"
                                className={`difficulty-btn difficulty-btn--${level} ${difficulty === level ? 'difficulty-btn--active' : ''}`}
                                onClick={() => setDifficulty(level)}
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                        ))}
                    </div>

                    <input
                        type="url"
                        placeholder="LeetCode URL (optional)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <textarea
                        placeholder="Problem description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onInput={(e) => {
                            e.target.style.height = 'auto'
                            e.target.style.height = e.target.scrollHeight + 'px'
                        }}
                    />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">{isEditing ? 'Save' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
