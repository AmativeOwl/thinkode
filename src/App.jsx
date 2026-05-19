import { useState, useEffect } from 'react'
import useProblems from './hooks/useProblems.js'
import StartPage from './components/start/StartPage'
import ProblemView from "./components/problem/ProblemView"
import AddProblemModal from "./components/shared/AddProblemModal"
import './App.css'

export default function App() {
  // destructure problems and addProblem from the useProblems hook
  const { problems, addProblem, updateProblem } = useProblems()
  const [activeProblemId, setActiveProblemId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [recentProblemIds, setRecentProblemIds] = useState([])

  // Upon re-rendering, if activeProblemId is not null, add it to the front of recentProblemIds, ensuring no duplicates and a max length of 5
  // Keeps a stack of recently viewed problems for easy access in the ProblemView sidebar
  useEffect(() => {
    if (!activeProblemId) return
    setRecentProblemIds(prev =>
      prev.includes(activeProblemId) ? prev : [...prev, activeProblemId]
    )
  }, [activeProblemId])

  function removeFromRecent(id) {
    setRecentProblemIds(prev => prev.filter(p => p !== id))
  }

  const activeProblem = problems.find(p => p.id === activeProblemId) ?? null
  const recentProblems = recentProblemIds.map(id => problems.find(p => p.id === id)).filter(Boolean)

  return (
    <>
      {/* if no active problem, show start page, otherwise show problem view */}
      {activeProblemId === null || !activeProblem
        ? (
          <StartPage
            problems={problems}
            onSelectProblem={(id) => setActiveProblemId(id)}
            onAddProblem={() => setShowAddModal(true)}
          />
        ) : (
          <ProblemView
            problem={activeProblem}
            recentProblems={recentProblems}
            onSelectProblem={(id) => setActiveProblemId(id)}
            onBack={() => setActiveProblemId(null)}
            onRemoveRecent={removeFromRecent}
          />
        )
      }

      {/* if showAddModal is true, show the AddProblemModal component */}
      {showAddModal && (
        <AddProblemModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (fields) => {
            const newProblem = await addProblem(fields)
            if (newProblem) setActiveProblemId(newProblem.id)
            setShowAddModal(false)
          }}
        />
      )}
    </>
  )
}