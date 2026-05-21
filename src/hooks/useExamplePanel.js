import { useState } from 'react'

export default function useExamplePanel({ examples, onAdd, onUpdate, onDelete }) {
    const [activeTab, setActiveTab] = useState(0)
    const [editingId, setEditingId] = useState(null)
    const [draft, setDraft] = useState({ input: '', output: '' })
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    const active = examples.length
        ? examples[Math.min(activeTab, examples.length - 1)]
        : null

    function switchTab(i) {
        setActiveTab(i)
        setEditingId(null)
        setConfirmDeleteId(null)
    }

    function startEdit(ex) {
        setEditingId(ex.id)
        setDraft({ input: ex.input ?? '', output: ex.output ?? '' })
        setConfirmDeleteId(null)
    }

    async function handleSave() {
        await onUpdate(editingId, { input: draft.input, output: draft.output })
        setEditingId(null)
    }

    async function handleCancel() {
        const original = examples.find(e => e.id === editingId)
        if (original && !original.input && !original.output) {
            await onDelete(editingId)
            setActiveTab(prev => Math.max(0, prev - 1))
        }
        setEditingId(null)
    }

    async function handleDelete(id) {
        await onDelete(id)
        setConfirmDeleteId(null)
        setActiveTab(prev => Math.min(prev, Math.max(0, examples.length - 2)))
    }

    async function handleAddExample() {
        if (examples.length >= 5) return
        const newEx = await onAdd()
        if (newEx) {
            setActiveTab(examples.length)
            setEditingId(newEx.id)
            setDraft({ input: '', output: '' })
            setConfirmDeleteId(null)
        }
    }

    return {
        activeTab, editingId, draft, setDraft,
        confirmDeleteId, setConfirmDeleteId,
        active, switchTab, startEdit,
        handleSave, handleCancel, handleDelete, handleAddExample,
    }
}
