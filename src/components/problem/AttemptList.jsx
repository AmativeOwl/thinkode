import { useRef, useState } from 'react'
import AttemptCard from './AttemptCard'
import './AttemptList.css'

export default function AttemptList({ attempts, loading }) {
    const [showEvolution, setShowEvolution] = useState(false)
    const cardsRef = useRef(null)

    const reversed = [...attempts].reverse()

    // render the list of attempts with a skeleton loading state
    return (
        <div className="attempt-list">
            <div className="attempt-list-right">
                <div className="attempt-list-cards" ref={cardsRef}>
                    {loading && (
                        <div className="attempt-card skeleton">
                            <div className="skeleton-line skeleton-line--short" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line skeleton-line--medium" />
                            <div className="skeleton-feedback" />
                        </div>
                    )}
                    {!loading && attempts.length === 0 && <p>No attempts yet. Start solving!</p>}
                    {reversed.map((attempt, index) => (
                        <AttemptCard key={attempt.id} attempt={attempt} index={reversed.length - index} />
                    ))}
                    {console.log(attempts)}
                </div>
            </div>
        </div>
    )
}
