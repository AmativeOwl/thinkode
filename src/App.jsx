import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import useProblems from './hooks/useProblems.js'
import StartPage from './components/start/StartPage'
import ProblemView from "./components/problem/ProblemView"
import AddProblemModal from "./components/shared/AddProblemModal"
import './App.css'

export default function App() {
  // destructing problems and related functions from useProblems
  const { problems, addProblem, updateProblem, deleteProblem } = useProblems()
  const [showAddModal, setShowAddModal] = useState(false)
  const [recentProblemIds, setRecentProblemIds] = useState([])
  const navigate = useNavigate()

  // selects problem by id, adding it to the list of recent problems if it's not already there and navigates to it 
  function handleSelectProblem(id) {
    setRecentProblemIds(prev => prev.includes(id) ? prev : [...prev, id])
    navigate(`/problem/${id}`)
  }

  // adds a new problem and navigates to it, closing the pop-up add modal
  const handleAdd = async (fields) => {
    const newProblem = await addProblem(fields)
    if (newProblem) handleSelectProblem(newProblem.id)
    setShowAddModal(false)
  }

  // removes a problem from the list of recent problems, navigating back to the start page if no recent problems left 
  function removeFromRecent(id) {
    const updated = recentProblemIds.filter(p => p !== id)
    setRecentProblemIds(updated)
    if (updated.length === 0) navigate('/')
  }

  // capturing the recent problems based on the list of recent problem ids, filtering out any that might be deleted via Boolean evaluation
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
          onAdd={handleAdd}
        />
      )}
    </>
  )
}
