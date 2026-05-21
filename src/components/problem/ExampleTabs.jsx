import { useState } from 'react'

export default function ExampleTabs({ examples }) {
    const [activeTab, setActiveTab] = useState(0)
    const active = examples[activeTab]

    if (!examples.length) return null

    return (
        <div className="example-tabs">
            <div className="example-tab-bar">
                {examples.map((_, i) => (
                    <div key={i} className={`example-tab${activeTab === i ? ' example-tab--active' : ''}`}>
                        <button type="button" onClick={() => setActiveTab(i)}>
                            Example {i + 1}
                        </button>
                    </div>
                ))}
            </div>
            {active && (
                <div className="example-tab-content">
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
                </div>
            )}
        </div>
    )
}
