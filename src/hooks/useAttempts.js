import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase.js'

export default function useAttempts(problemId) {
    const [attempts, setAttempts] = useState([])
    const [loading, setLoading] = useState(true)

    // Retrieve a list of attempts for a given problem from the database, and provide a function to add new attempts. 
    // Each attempt includes the steps taken and feedback received, allowing users to track their problem-solving process over time.
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

    // Adding a new attempt involves inserting a record into the 'attempts' table with the associated problem ID, steps taken, and feedback received. 
    // After successfully adding the attempt to the database, it updates the local state to include the new attempt in the list.
    async function addAttempt(steps, feedback) {
        const { data, error } = await supabase
            .from('attempts')
            .insert({ problem_id: problemId, steps, feedback })
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