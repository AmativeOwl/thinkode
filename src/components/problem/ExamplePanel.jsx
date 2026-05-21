import { forwardRef, useImperativeHandle } from 'react'
import useExamplePanel from '../../hooks/useExamplePanel'
import ExampleEditForm from './ExampleEditForm'
import './ExamplePanel.css'

const ExamplePanel = forwardRef(function ExamplePanel({ examples, onAdd, onUpdate, onDelete }, ref) {
    const {
        activeTab, editingId, draft, setDraft,
        confirmDeleteId, setConfirmDeleteId,
        active, switchTab, startEdit,
        handleSave, handleCancel, handleDelete, handleAddExample,
    } = useExamplePanel({ examples, onAdd, onUpdate, onDelete })

    useImperativeHandle(ref, () => ({ addExample: handleAddExample }), [examples.length, onAdd])

    if (examples.length === 0) return null

    return (
        <div className="example-tabs">
            <div className="example-tab-bar">
                {examples.map((ex, i) => (
                    <div key={ex.id} className={`example-tab${activeTab === i ? ' example-tab--active' : ''}`}>
                        <button type="button" onClick={() => switchTab(i)}>
                            Example {i + 1}
                        </button>
                        <button
                            type="button"
                            className="example-tab-close"
                            onClick={() => { switchTab(i); setConfirmDeleteId(ex.id) }}
                            aria-label={`Delete example ${i + 1}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                            </svg>
                        </button>
                    </div>
                ))}
                {examples.length < 5 && (
                    <button type="button" className="example-tab-add" onClick={handleAddExample}>+</button>
                )}
            </div>

            {active && (
                <div className="example-tab-content">
                    {editingId === active.id ? (
                        <ExampleEditForm
                            draft={draft}
                            onChange={(field, value) => setDraft(prev => ({ ...prev, [field]: value }))}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    ) : confirmDeleteId === active.id ? (
                        <div className="example-confirm-area">
                            <span>Delete this example?</span>
                            <button className="confirm-yes" onClick={() => handleDelete(active.id)}>Yes</button>
                            <button className="confirm-no" onClick={() => setConfirmDeleteId(null)}>No</button>
                        </div>
                    ) : (
                        <>
                            <div className="example-tab-fields">
                                {active.input && (
                                    <div className="example-field">
                                        <span className="example-field-label">Input</span>
                                        <pre>{active.input}</pre>
                                    </div>
                                )}
                                {active.output && (
                                    <div className="example-field">
                                        <span className="example-field-label">Output</span>
                                        <pre>{active.output}</pre>
                                    </div>
                                )}
                            </div>
                            <div className="example-display-actions">
                                <button className="example-action-btn" onClick={() => startEdit(active)} aria-label="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                        <path d="m15 5 4 4"/>
                                    </svg>
                                </button>
                                <button className="example-action-btn example-action-btn--delete" onClick={() => setConfirmDeleteId(active.id)} aria-label="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
})

export default ExamplePanel
