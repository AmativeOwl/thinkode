import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase.js'

export default function useProblems() {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)

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