import { useState } from 'react'
import '../styles/AddQuestion.css'

function AddQuestion({ onAdd }) {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState(['', '', '', ''])
  const [correct, setCorrect] = useState(0)
  const [errors, setErrors] = useState([])

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value)
  }

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleCorrectChange = (index) => {
    setCorrect(index)
  }

  const validateForm = () => {
    const newErrors = []

    if (!question.trim()) {
      newErrors.push('Question cannot be empty')
    }

    for (let i = 0; i < answers.length; i++) {
      if (!answers[i].trim()) {
        newErrors.push(`Answer ${String.fromCharCode(65 + i)} cannot be empty`)
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onAdd({
      question: question.trim(),
      answers: answers.map(a => a.trim()),
      correct: correct
    })

    // Reset form
    setQuestion('')
    setAnswers(['', '', '', ''])
    setCorrect(0)
    setErrors([])
  }

  return (
    <form className="add-question-form" onSubmit={handleSubmit}>
      <h3>Add New Question</h3>

      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your question here"
          rows="3"
        />
      </div>

      <div className="answers-section">
        <p className="answers-label">Answers</p>
        {answers.map((answer, index) => (
          <div key={index} className="answer-input-group">
            <label>
              <input
                type="radio"
                name="correct-answer"
                checked={correct === index}
                onChange={() => handleCorrectChange(index)}
              />
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Answer ${String.fromCharCode(65 + index)}`}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="submit-button">
        Add Question
      </button>
    </form>
  )
}

export default AddQuestion
