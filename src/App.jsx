import { useState } from 'react'
import useProblems from './hooks/useProblems'
import StartPage from './components/StartPage'
import ProblemView from "./components/ProblemView"
import AddProblemModal from "./components/AddProblemModal"
import './App.css'

function App() {
  // destructure problems from the useProblems hook
  const { problems } = useProblems()
  const [activeProblemId, setActiveProblemId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const activeProblem = problems.find(p => p.id === activeProblemId) ?? null

  return (
    <>
      {/* if no active problem, show start page, otherwise show problem view */}
      {activeProblemId === null
        ? (
          <StartPage
            problems={problems}
            onSelectProblem={(id) => setActiveProblemId(id)}
            onAddProblem={() => setShowAddModal(true)}
          />
        ) : (
          <ProblemView
            problem={activeProblem}
            onBack={() => setActiveProblemId(null)}
          />
        )
      }

      {/* if showAddModal is true, show the AddProblemModal component */}
      {showAddModal && (
        <AddProblemModal
          onClose={() => setShowAddModal(false)}
          onAdd={(id) => {
            setShowAddModal(false)
            setActiveProblemId(id)
          }}
        />
      )}
    </>
  )
}

export default App
