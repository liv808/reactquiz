import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const QUESTIONS_FILE = path.join(__dirname, 'public', 'questions.json')

// Middleware
app.use(express.json())

// Helper function to read questions
const readQuestions = () => {
  try {
    const data = fs.readFileSync(QUESTIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading questions:', error)
    return { version: 1, questions: [] }
  }
}

// Helper function to write questions
const writeQuestions = (data) => {
  try {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing questions:', error)
    return false
  }
}

// GET - Fetch all questions
app.get('/api/questions', (req, res) => {
  const data = readQuestions()
  res.json(data.questions || [])
})

// POST - Add a new question
app.post('/api/questions', (req, res) => {
  const { question, answers, correct } = req.body

  // Validate input
  if (!question || !Array.isArray(answers) || answers.length !== 4 || correct === undefined) {
    return res.status(400).json({ error: 'Invalid question format' })
  }

  const data = readQuestions()
  
  // Generate the next sequential ID
  const maxId = data.questions.length > 0 
    ? Math.max(...data.questions.map(q => q.id)) 
    : 0
  
  const newQuestion = {
    id: maxId + 1,
    question,
    answers,
    correct
  }

  data.questions.push(newQuestion)

  if (writeQuestions(data)) {
    res.status(201).json(newQuestion)
  } else {
    res.status(500).json({ error: 'Failed to save question' })
  }
})

// DELETE - Remove a question
app.delete('/api/questions/:id', (req, res) => {
  const { id } = req.params
  const questionId = parseInt(id)

  const data = readQuestions()
  const initialLength = data.questions.length
  data.questions = data.questions.filter(q => q.id !== questionId)

  if (data.questions.length === initialLength) {
    return res.status(404).json({ error: 'Question not found' })
  }

  if (writeQuestions(data)) {
    res.json({ success: true })
  } else {
    res.status(500).json({ error: 'Failed to delete question' })
  }
})

app.listen(PORT, () => {
  console.log(`Quiz API server running at http://localhost:${PORT}`)
})
