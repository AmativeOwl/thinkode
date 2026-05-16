import AttemptCard from './AttemptCard'
import AttemptEditor from './AttemptEditor'
import useAttempts from '../../hooks/useAttempts'
import './AttemptList.css'

export default function AttemptList({ problem }) {
    const { attempts, addAttempt } = useAttempts(problem.id)

    // Displays a list of attempts for the currently active problem. 
    return (
        <div className="attempt-list">
            {attempts.length === 0 && <p>No attempts yet. Start solving!</p>}
            {attempts.map((attempt, index) => (
                <AttemptCard key={attempt.id} attempt={attempt} index={index + 1} />
            ))}
            <AttemptEditor onSubmit={addAttempt} problemTitle={problem.title} />
        </div>
    )
}