import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase.js'

export default function useProblems() {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)

    // Manages the list of coding problems, fetching the problems from the database on initial load. 
    // Returns the current list of problems, a loading state, and the function to add problems.
    useEffect(() => {
        async function fetchProblems() {
            const { data, error } = await supabase
                .from('problems')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching problems:', error)
            } else {
                setProblems(data)
            }
            setLoading(false)
        }

        fetchProblems()
    }, [])

    // Adds a new problem to the database and updates the local state with the newly added problem. 
    // It takes an object with the problem fields (title, difficulty, url) as input, inserts it into the 'problems' table, and upon success, appends the new problem to the existing list of problems in state.
    async function addProblem(fields) {
        const { data, error } = await supabase
            .from('problems')
            .insert(fields)
            .select()
            .single()

        if (error) {
            console.error('Error adding problem:', error)
            return null
        }

        setProblems(prev => [...prev, data])
        return data
    }

    return { problems, loading, addProblem }
}