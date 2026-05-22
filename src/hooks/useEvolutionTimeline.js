import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../libs/supabase.js'

function buildTimeline(milestones, unclearTimes) {
    const result = []

    function countBetween(after, before) {
        return unclearTimes.filter(({ created_at: t }) =>
            (!after || t > after) && (!before || t < before)
        ).length
    }

    for (let i = 0; i <= milestones.length; i++) {
        const after = i === 0 ? null : milestones[i - 1].created_at
        const before = i === milestones.length ? null : milestones[i]?.created_at ?? null
        const count = countBetween(after, before)
        if (count > 0) result.push({ type: 'group', count, after, before })
        if (i < milestones.length) result.push({ type: 'milestone', ...milestones[i] })
    }

    return result
}

export default function useEvolutionTimeline(problemId) {
    const [timeline, setTimeline] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        if (!problemId) {
            setTimeline([])
            setLoading(false)
            return
        }

        async function fetchTimeline() {
            const [{ data: milestones, error: mErr }, { data: unclear, error: uErr }] = await Promise.all([
                supabase
                    .from('attempts')
                    .select('*')
                    .eq('problem_id', problemId)
                    .not('summary', 'is', null)
                    .not('summary', 'ilike', 'Attempt%')
                    .order('created_at', { ascending: true }),
                supabase
                    .from('attempts')
                    .select('created_at')
                    .eq('problem_id', problemId)
                    .or('summary.is.null,summary.ilike.Attempt%')
                    .order('created_at', { ascending: true }),
            ])

            if (mErr || uErr) {
                console.error('Timeline fetch error:', mErr ?? uErr)
                setLoading(false)
                return
            }

            setTimeline(buildTimeline(milestones ?? [], unclear ?? []))
            setLoading(false)
        }

        fetchTimeline()
    }, [problemId, refreshKey])

    const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

    const fetchGroupAttempts = useCallback(async (after, before) => {
        let query = supabase
            .from('attempts')
            .select('*')
            .eq('problem_id', problemId)
            .or('summary.is.null,summary.ilike.Attempt%')
            .order('created_at', { ascending: true })
        if (after)  query = query.gt('created_at', after)
        if (before) query = query.lt('created_at', before)
        const { data, error } = await query
        if (error) { console.error(error); return [] }
        return data ?? []
    }, [problemId])

    return { timeline, loading, fetchGroupAttempts, refresh }
}