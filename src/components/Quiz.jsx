import { useState, useEffect } from 'react'
import '../styles/Quiz.css'
import QuestionCard from './QuestionCard'
import { shuffleArray, shuffleAnswers } from '../utils/shuffle'

function Quiz({ questions, onRemove, shuffleQuestions: shouldShuffleQuestions, shuffleAnswers: shouldShuffleAnswers }) {
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showScore, setShowScore] = useState(false)

  // Initialize quizQuestions when questions prop changes
  useEffect(() => {
    let processedQuestions = [...questions]

    // Shuffle questions if enabled
    if (shouldShuffleQuestions) {
      processedQuestions = shuffleArray(processedQuestions)
    }

    // Shuffle answers for each question if enabled
    if (shouldShuffleAnswers) {
      processedQuestions = processedQuestions.map((q) => shuffleAnswers(q))
    }

    setQuizQuestions(processedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setScore(0)
    setWrongCount(0)
    setShowScore(false)
  }, [questions, shouldShuffleQuestions, shouldShuffleAnswers])

  if (quizQuestions.length === 0) {
    return <div className="no-questions">No questions available</div>
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]

  const handleAnswerClick = (answerIndex) => {
    if (!answered) {
      setSelectedAnswer(answerIndex)
      setAnswered(true)

      if (answerIndex === currentQuestion.correct) {
        setScore(score + 1)
      } else {
        // Add wrong question to the back of the list
        let questionToAppend = currentQuestion
        
        // Shuffle answers again if shuffle answers option is enabled
        if (shouldShuffleAnswers) {
          questionToAppend = shuffleAnswers(currentQuestion)
        }
        
        setQuizQuestions([...quizQuestions, questionToAppend])
        setWrongCount(wrongCount + 1)
      }
    }
  }

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowScore(true)
    }
  }

  const handleRestart = () => {
    let processedQuestions = [...questions]

    // Shuffle questions if enabled
    if (shouldShuffleQuestions) {
      processedQuestions = shuffleArray(processedQuestions)
    }

    // Shuffle answers for each question if enabled
    if (shouldShuffleAnswers) {
      processedQuestions = processedQuestions.map((q) => shuffleAnswers(q))
    }

    setQuizQuestions(processedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setScore(0)
    setWrongCount(0)
    setShowScore(false)
  }

  const handleRemove = (id) => {
    onRemove(id)
    const updatedQuizQuestions = quizQuestions.filter(q => q.id !== id)
    setQuizQuestions(updatedQuizQuestions)
    if (currentQuestionIndex >= updatedQuizQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
    }
  }

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="quiz-result">
          <h2>Quiz Complete!</h2>
          <div className="result-score">
            Correct: <span>{score}</span>
          </div>
          <div className="result-wrong">
            Wrong: <span>{wrongCount}</span>
          </div>
          <div className="result-total">
            Total: <span>{score + wrongCount}</span>
          </div>
          <p className="result-percentage">
            {Math.round((score / (score + wrongCount)) * 100)}% Accuracy
          </p>
          <button className="restart-button" onClick={handleRestart}>
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-content">
          <div className="quiz-progress">
            <p>
              Question <span>{currentQuestionIndex + 1}</span> of{' '}
              <span>{quizQuestions.length}</span>
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            answered={answered}
            onAnswerClick={handleAnswerClick}
            onRemove={handleRemove}
          />

          {answered && (
            <button className="next-button" onClick={handleNext}>
              {currentQuestionIndex === quizQuestions.length - 1
                ? 'See Results'
                : 'Next Question'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Quiz
