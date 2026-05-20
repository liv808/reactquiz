import { useState } from 'react'
import '../styles/QuestionCard.css'

function QuestionCard({
  question,
  selectedAnswer,
  answered,
  onAnswerClick,
  onRemove
}) {
  const [showMenu, setShowMenu] = useState(false)

  const getAnswerClass = (index) => {
    let className = 'answer-button'

    if (!answered) {
      return className
    }

    if (index === question.correct) {
      className += ' correct'
    } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
      className += ' incorrect'
    }

    return className
  }

  const handleDeleteClick = () => {
    onRemove(question.id)
    setShowMenu(false)
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <h2 className="question-text">{question.question}</h2>
        <div className="menu-container">
          <button
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
            title="Options"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button
                className="delete-menu-item"
                onClick={handleDeleteClick}
              >
                Delete Question
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="answers-container">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={getAnswerClass(index)}
            onClick={() => onAnswerClick(index)}
            disabled={answered}
          >
            <span className="answer-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="answer-text">{answer}</span>
            {answered && index === question.correct && (
              <span className="correct-icon">✓</span>
            )}
            {answered &&
              index === selectedAnswer &&
              index !== question.correct && (
                <span className="incorrect-icon">✗</span>
              )}
          </button>
        ))}
      </div>

      {answered && selectedAnswer === question.correct && (
        <div className="feedback correct-feedback">Correct! Well done! 🎉</div>
      )}
      {answered && selectedAnswer !== question.correct && (
        <div className="feedback incorrect-feedback">
          Incorrect. The correct answer is{' '}
          <strong>{question.answers[question.correct]}</strong>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
