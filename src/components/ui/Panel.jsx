import { useState } from 'react'
import "./Panel.css"

export default function Panel({ title, isOpen, onClose, tabs }) {
    const [activeTab, setActiveTab] = useState(tabs[0].id)
    const activeContent = tabs.find(t => t.id === activeTab)?.content

    return (
        <div className={`panel ${isOpen ? 'panel--open' : ''}`}>
            <div className="panel-header">
                <h2>{title}</h2>
                <button className="panel-close" onClick={onClose}>×</button>
            </div>
            <div className="panel-tabs-wrapper">
                <div className="panel-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`panel-tab ${activeTab === tab.id ? 'panel-tab--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="panel-body">
                {activeContent}
            </div>
        </div>
    )
}