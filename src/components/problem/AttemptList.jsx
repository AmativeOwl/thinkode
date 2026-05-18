import { useRef } from 'react'
import AttemptCard from './AttemptCard'
import AttemptEditor from './AttemptEditor'
import Vine from '../ui/Vine'
import useAttempts from '../../hooks/useAttempts'
import './AttemptList.css'

export default function AttemptList({ problem }) {
    const { attempts, addAttempt } = useAttempts(problem.id)
    const cardsRef = useRef(null)

    // Displays a list of attempts for the currently active problem.
    return (
        <div className="attempt-list">
            <AttemptEditor onSubmit={addAttempt} problemTitle={problem.title} problemUrl={problem.url} />
            <div className="attempt-list-right">
                <div className="attempt-list-cards" ref={cardsRef}>
                    {attempts.length === 0 && <p>No attempts yet. Start solving!</p>}
                    {attempts.map((attempt, index) => (
                        <AttemptCard key={attempt.id} attempt={attempt} index={index + 1} />
                    ))}
                </div>
                <Vine scrollRef={cardsRef} />
            </div>
        </div>
    )
}
