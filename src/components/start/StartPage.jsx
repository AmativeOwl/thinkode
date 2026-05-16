import "./StartPage.css"

function StartPage({ problems, onSelectProblem, onAddProblem }) {
  return (
    <div className="start-page">
      <h1>Thinkode</h1>
      <p>Welcome to Thinkode! Please select a problem to get started.</p>
        <div className="problem-list">
            {problems.map((problem) => (
                <div
                    key={problem.id}
                    className="problem-card"
                    onClick={() => onSelectProblem(problem.id)}
                >
                    <h2>{problem.title}</h2>
                    <p>{problem.description}</p>
                </div>
            ))}
        </div>
        <button onClick={onAddProblem}>Add New Problem</button>
    </div>
  )
}