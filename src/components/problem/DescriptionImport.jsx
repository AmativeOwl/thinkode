import "./DescriptionImport.css"
import { useState } from "react"

export default function DescriptionImport({ problemDescription }) {
    const [expanded, setExpanded] = useState(true)

    return (
        <div className="problem-description-container">
            <button className="description-toggle" onClick={() => setExpanded(prev => !prev)}>
                <span className="description-title">Problem Description</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={expanded ? 'chevron--open' : ''}
                >
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
            {expanded && (
                <div className="problem-description">
                    <pre>{problemDescription}</pre>
                </div>
            )}
        </div>
    )
}
