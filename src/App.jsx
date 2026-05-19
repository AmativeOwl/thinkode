import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import useProblems from './hooks/useProblems.js'
import StartPage from './components/start/StartPage'
import ProblemView from "./components/problem/ProblemView"
import AddProblemModal from "./components/shared/AddProblemModal"
import './App.css'

export default function App() {
  const { problems, addProblem, updateProblem, deleteProblem } = useProblems()
  const [showAddModal, setShowAddModal] = useState(false)
  const [recentProblemIds, setRecentProblemIds] = useState([])
  const navigate = useNavigate()

  function handleSelectProblem(id) {
    setRecentProblemIds(prev => prev.includes(id) ? prev : [...prev, id])
    navigate(`/problem/${id}`)
  }

  function removeFromRecent(id) {
    const updated = recentProblemIds.filter(p => p !== id)
    setRecentProblemIds(updated)
    if (updated.length === 0) navigate('/')
  }

  const recentProblems = recentProblemIds.map(id => problems.find(p => p.id === id)).filter(Boolean)

  return (
    <>
      <Routes>
        <Route path="/" element={
          <StartPage
            problems={problems}
            onSelectProblem={handleSelectProblem}
            onAddProblem={() => setShowAddModal(true)}
            onEditProblem={updateProblem}
            onDeleteProblem={deleteProblem}
          />
        } />
        <Route path="/problem/:id" element={
          <ProblemView
            problems={problems}
            recentProblems={recentProblems}
            onSelectProblem={handleSelectProblem}
            onBack={() => navigate('/')}
            onRemoveRecent={removeFromRecent}
          />
        } />
      </Routes>

      {showAddModal && (
        <AddProblemModal
          problems={problems}
          onClose={() => setShowAddModal(false)}
          onAdd={async (fields) => {
            const newProblem = await addProblem(fields)
            if (newProblem) handleSelectProblem(newProblem.id)
            setShowAddModal(false)
          }}
        />
      )}
    </>
  )
}
