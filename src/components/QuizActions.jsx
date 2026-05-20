import { useRef } from 'react'
import '../styles/QuizActions.css'

function QuizActions({ questions, onImport }) {
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const quizData = {
      version: 1,
      questions: questions,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(quizData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `quiz-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result
        if (typeof content !== 'string') {
          alert('Error reading file')
          return
        }

        const quizData = JSON.parse(content)

        // Validate the import format
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
          alert('Invalid quiz format')
          return
        }

        // Ensure all questions have required fields
        const isValid = quizData.questions.every(
          (q) =>
            q.question &&
            Array.isArray(q.answers) &&
            q.answers.length === 4 &&
            q.correct !== undefined
        )

        if (!isValid) {
          alert('Some questions are missing required fields')
          return
        }

        onImport(quizData.questions)
        alert(`Successfully imported ${quizData.questions.length} questions!`)
      } catch (error) {
        alert('Error importing quiz. Make sure it\'s a valid quiz file.')
        console.error(error)
      }
    }
    reader.readAsText(file)

    // Reset input so the same file can be selected again
    event.target.value = ''
  }

  return (
    <div className="quiz-actions">
      <div className="actions-group">
        <button
          className="action-button export-button"
          onClick={handleExport}
          title="Export quiz as JSON file"
        >
          📥 Export Quiz
        </button>
        <button
          className="action-button import-button"
          onClick={handleImportClick}
          title="Import a quiz from JSON file"
        >
          📤 Import Quiz
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
      <p className="actions-info">
        Export your quiz to share with friends, or import a quiz file from someone else
      </p>
    </div>
  )
}

export default QuizActions
