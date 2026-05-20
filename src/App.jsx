import { useState, useEffect } from 'react'
import './App.css'
import Quiz from './components/Quiz'
import AddQuestion from './components/AddQuestion'

function App() {
  const [questions, setQuestions] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [shuffleAnswers, setShuffleAnswers] = useState(false)

  // Load questions from API on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/questions')
        if (!response.ok) {
          throw new Error('Failed to load questions')
        }
        const data = await response.json()
        setQuestions(data || [])
        setError(null)
      } catch (err) {
        console.error('Error loading questions:', err)
        setError('Failed to load questions from server')
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  const addQuestion = async (newQuestion) => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
      })

      if (!response.ok) {
        throw new Error('Failed to add question')
      }

      const addedQuestion = await response.json()
      const updatedQuestions = [...questions, addedQuestion]
      setQuestions(updatedQuestions)
      setShowAddForm(false)
    } catch (err) {
      console.error('Error adding question:', err)
      alert('Failed to add question. Please try again.')
    }
  }

  const removeQuestion = async (id) => {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete question')
      }

      const updatedQuestions = questions.filter(q => q.id !== id)
      setQuestions(updatedQuestions)
    } catch (err) {
      console.error('Error deleting question:', err)
      alert('Failed to delete question. Please try again.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Quiz Master</h1>
        <p>Test your knowledge or add your own questions</p>
      </header>

      {loading ? (
        <div className="loading-container">
          <p>Loading quiz questions...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : (
        <div className="app-container">
          <div className="quiz-section">
            {questions.length > 0 ? (
              <>
                <div className="shuffle-controls">
                  <label className="shuffle-option">
                    <input
                      type="checkbox"
                      checked={shuffleQuestions}
                      onChange={(e) => setShuffleQuestions(e.target.checked)}
                    />
                    <span>Shuffle Questions</span>
                  </label>
                  <label className="shuffle-option">
                    <input
                      type="checkbox"
                      checked={shuffleAnswers}
                      onChange={(e) => setShuffleAnswers(e.target.checked)}
                    />
                    <span>Shuffle Answers</span>
                  </label>
                </div>
                <Quiz
                  questions={questions}
                  onRemove={removeQuestion}
                  shuffleQuestions={shuffleQuestions}
                  shuffleAnswers={shuffleAnswers}
                />
              </>
            ) : (
              <div className="no-questions">
                <p>No questions available. Add some questions to get started!</p>
              </div>
            )}
          </div>

          <div className="add-section">
            {!showAddForm ? (
              <button
                className="add-button"
                onClick={() => setShowAddForm(true)}
              >
                + Add Question
              </button>
            ) : (
              <>
                <AddQuestion onAdd={addQuestion} />
                <button
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
