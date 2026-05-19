import { useRef, useState } from 'react'
import AttemptCard from './AttemptCard'
import Vine from '../ui/Vine'
import './AttemptList.css'

export default function AttemptList({ attempts }) {
    const [showEvolution, setShowEvolution] = useState(false)
    const cardsRef = useRef(null)

    // Displays a list of attempts for the currently active problem.
    return (
        <div className="attempt-list">
            <div className="attempt-list-right">
                <div className="attempt-list-cards" ref={cardsRef}>
                    {attempts.length === 0 && <p>No attempts yet. Start solving!</p>}
                    {attempts.length > 0 && <h3>Previous Attempts</h3> }
                    {attempts.map((attempt, index) => (
                        <AttemptCard key={attempt.id} attempt={attempt} index={index + 1} />
                    ))}
                </div>
                <Vine scrollRef={cardsRef} />
            </div>
        </div>
    )
}
