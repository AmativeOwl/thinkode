import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase.js'

export default function useAttempts(problemId) {
    const [attempts, setAttempts] = useState([])
    const [loading, setLoading] = useState(true)

    // retrieves the list of attempts for a problem ID from the database, updating the attempts and loading states.
    useEffect(() => {
        async function fetchAttempts() {
            const { data, error } = await supabase
                .from('attempts')
                .select('*')
                .eq('problem_id', problemId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching attempts:', error)
            } else {
                setAttempts(data)
            }
            setLoading(false)
        }

        if (problemId) {
            fetchAttempts()
        } else {
            setAttempts([])
            setLoading(false)
        }
    }, [problemId])

    // adds a new attempt to the database for a problem ID, updating the attempts state with the newly added attempt.
    async function addAttempt(steps, feedback, examples = null) {
        const { data, error } = await supabase
            .from('attempts')
            .insert({ problem_id: problemId, steps, feedback, examples })
            .select()
            .single()

        if (error) {
            console.error('Error adding attempt:', error)
            return null
        }

        setAttempts(prev => [...prev, data])
        return data
    }

    return { attempts, loading, addAttempt }
}