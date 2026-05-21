import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase.js'

export default function useProblemExamples(problemId) {
    const [examples, setExamples] = useState([])

    useEffect(() => {
        if (!problemId) { setExamples([]); return }

        async function fetchExamples() {
            const { data } = await supabase
                .from('problem_examples')
                .select('*')
                .eq('problem_id', problemId)
                .order('created_at', { ascending: true })

            const rows = data ?? []
            // clean up any blank rows left by cancelled "+" sessions
            const empty = rows.filter(e => !e.input && !e.output)
            for (const e of empty) {
                await supabase.from('problem_examples').delete().eq('id', e.id)
            }
            setExamples(rows.filter(e => e.input || e.output))
        }

        fetchExamples()
    }, [problemId])

    async function addExample() {
        const { data } = await supabase
            .from('problem_examples')
            .insert({ problem_id: problemId, input: '', output: '' })
            .select()
            .single()
        if (data) setExamples(prev => [...prev, data])
        return data
    }

    async function updateExample(id, fields) {
        const { data } = await supabase
            .from('problem_examples')
            .update(fields)
            .eq('id', id)
            .select()
            .single()
        if (data) setExamples(prev => prev.map(e => e.id === id ? data : e))
    }

    async function deleteExample(id) {
        await supabase.from('problem_examples').delete().eq('id', id)
        setExamples(prev => prev.filter(e => e.id !== id))
    }

    return { examples, addExample, updateExample, deleteExample }
}
