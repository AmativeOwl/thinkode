import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase.js'

export default function useProblems() {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)

    // fetches the list of problems from the database upon initial load
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

    // Adds a new problem to the database and updates the array of problems in state 
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

    // updating an existing problem in the database, reflecting the change in the array of problems in state
    async function updateProblem(id, fields) {
        const { data, error } = await supabase
            .from('problems')
            .update(fields)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating problem:', error)
            return null
        }

        setProblems(prev => prev.map(p => p.id === id ? data : p))
        return data
    }

    // deletes a problem from the database and removes it from the array of problems in state
    async function deleteProblem(id) {
        const { error } = await supabase
            .from('problems')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting problem:', error)
            return false
        }

        setProblems(prev => prev.filter(p => p.id !== id))
        return true
    }

    return { problems, loading, addProblem, updateProblem, deleteProblem }
}