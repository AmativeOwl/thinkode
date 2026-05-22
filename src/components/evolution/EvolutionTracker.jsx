import { useState } from 'react'
import "./EvolutionTracker.css"

function parseSummary(summary) {
    if (!summary) return { category: null, technique: null }
    const parts = summary.split(' — ')
    return {
        category:  parts[0]?.trim() ?? null,
        technique: parts[1]?.trim() ?? null,
    }
}

function categoryClass(category) {
    if (!category) return 'unknown'
    return category.toLowerCase().replace(/\s+/g, '-')
}

const MILESTONE_H = 56
const GROUP_H     = 36
const SUB_H       = 44
const COL_W       = 20

function nodeHeight(node) {
    if (node.type === 'milestone') return MILESTONE_H
    if (node.type === 'group')     return GROUP_H
    return SUB_H
}

function computeLayout(nodes) {
    const centers = []
    let y = 0
    for (const node of nodes) {
        const h = nodeHeight(node)
        centers.push(y + h / 2)
        y += h
    }
    return { centers, totalH: y }
}

function buildPath(centers) {
    if (centers.length < 2) return ''
    const mid = COL_W / 2
    let d = `M${mid},${centers[0]}`
    for (let i = 0; i < centers.length - 1; i++) {
        const y0 = centers[i]
        const y1 = centers[i + 1]
        const h  = y1 - y0
        const cx = i % 2 === 0 ? COL_W - 2 : 2
        d += ` C${cx},${y0 + h * 0.4} ${cx},${y1 - h * 0.4} ${mid},${y1}`
    }
    return d
}

function FlowerNode({ x, y, className }) {
    const petals = [0, 72, 144, 216, 288].map(deg => {
        const rad = (deg * Math.PI) / 180
        return { cx: x + Math.cos(rad) * 4, cy: y + Math.sin(rad) * 4 }
    })
    return (
        <g className={`evolution-flower ${className ?? ''}`}>
            {petals.map(({ cx, cy }, i) => (
                <circle key={i} cx={cx} cy={cy} r="2.5" />
            ))}
            <circle cx={x} cy={y} r="2" />
        </g>
    )
}

export default function EvolutionTracker({ timeline, fetchGroupAttempts }) {
    const [expanded, setExpanded]       = useState({})
    const [loadingGroup, setLoadingGroup] = useState({})

    if (!timeline.length) {
        return <p className="evolution-empty">No attempts yet.</p>
    }

    // Flatten: replace expanded groups with their sub-attempt nodes
    const nodes = timeline.flatMap(node => {
        if (node.type !== 'group') return [node]
        const key = `${node.after}-${node.before}`
        const groupNode = { ...node, key }
        if (expanded[key]) return expanded[key].map(a => ({ type: 'sub', attempt: a }))
        return [groupNode]
    })

    const { centers, totalH } = computeLayout(nodes)

    async function handleToggleGroup(node) {
        const key = node.key
        if (expanded[key]) {
            setExpanded(prev => { const next = { ...prev }; delete next[key]; return next })
            return
        }
        setLoadingGroup(prev => ({ ...prev, [key]: true }))
        const attempts = await fetchGroupAttempts(node.after, node.before)
        setExpanded(prev => ({ ...prev, [key]: attempts }))
        setLoadingGroup(prev => { const next = { ...prev }; delete next[key]; return next })
    }

    return (
        <div className="evolution-timeline" style={{ height: totalH }}>
            <svg className="evolution-svg" width={COL_W} height={totalH} viewBox={`0 0 ${COL_W} ${totalH}`}>
                {centers.length > 1 && <path d={buildPath(centers)} className="evolution-path" />}
                {nodes.map((node, i) => {
                    if (node.type === 'group') {
                        return <circle key={node.key} cx={COL_W / 2} cy={centers[i]} r="2" className="evolution-group-dot" />
                    }
                    const attempt = node.type === 'sub' ? node.attempt : node
                    const { category } = parseSummary(attempt.summary)
                    const cls = categoryClass(category)
                    return (
                        <FlowerNode
                            key={attempt.id}
                            x={COL_W / 2}
                            y={centers[i]}
                            className={`evolution-flower--${cls}`}
                        />
                    )
                })}
            </svg>

            {nodes.map((node, i) => {
                if (node.type === 'group') {
                    return (
                        <button
                            key={node.key}
                            className="evolution-group"
                            style={{ top: centers[i] - GROUP_H / 2 }}
                            onClick={() => handleToggleGroup(node)}
                        >
                            {loadingGroup[node.key]
                                ? '...'
                                : `${node.count} attempt${node.count !== 1 ? 's' : ''}`}
                        </button>
                    )
                }

                const attempt = node.type === 'sub' ? node.attempt : node
                const { category, technique } = parseSummary(attempt.summary)
                const cls = categoryClass(category)

                return (
                    <div
                        key={attempt.id}
                        className={`evolution-content${node.type === 'sub' ? ' evolution-content--sub' : ''}`}
                        style={{ top: centers[i] }}
                    >
                        <div className="evolution-meta">
                            <span className={`evolution-label evolution-label--${cls}`}>
                                {category ?? 'Attempt'}
                            </span>
                            {technique && (
                                technique === 'unclear'
                                    ? <span className="evolution-technique">{technique}</span>
                                    : <a
                                        className="evolution-technique"
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(technique + ' algorithm explained')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {technique} ↗
                                    </a>
                            )}
                        </div>
                        <span className="evolution-date">
                            {new Date(attempt.created_at).toLocaleDateString()}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}