# React Quiz App

A React quiz application with multiple-choice questions, instant color-coded feedback, and question management backed by a JSON file.

## Features

- 4-answer multiple-choice questions
- Green/red feedback for correct and incorrect answers
- Score and wrong-answer tracking
- Questions can be added or deleted from the UI
- Changes are written to `public/questions.json`
- Questions load from `questions.json` on startup

## How It Works

The app uses a small Express API server to read and write the quiz data in `public/questions.json`.

- `GET /api/questions` loads the quiz questions
- `POST /api/questions` adds a new question to the JSON file
- `DELETE /api/questions/:id` removes a question from the JSON file

That means any question you add or delete from the UI is saved permanently in the JSON file, not in browser storage.

## Installation

1. Go to the project folder:

```bash
cd Reactquiz
```

2. Install dependencies:

```bash
npm install
```

## Running the App

Start both the API server and the Vite frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the API server runs on `http://localhost:3001`.

## Build

Create a production build with:

```bash
npm run build
```

Preview the build with:

```bash
npm run preview
```

## Using the Quiz

### Taking the quiz

1. Pick one of the 4 answers.
2. Correct answers turn green.
3. Incorrect answers turn red.
4. Wrong questions are added to the back of the queue.
5. When the quiz ends, you see your correct and wrong totals.

### Adding questions

1. Click `+ Add Question`.
2. Enter the question text.
3. Fill in all 4 answers.
4. Select the correct answer.
5. Submit the form.

The new question is added to `public/questions.json` immediately.

### Deleting questions

1. Open the question menu in the top-right corner of a card.
2. Click `Delete Question`.

The question is removed from `public/questions.json` immediately.

## Project Structure

```
public/
└── questions.json        # Quiz data source

src/
├── components/
│   ├── AddQuestion.jsx   # Form for new questions
│   ├── QuestionCard.jsx  # Single question UI
│   └── Quiz.jsx          # Quiz flow and scoring
├── styles/
│   ├── AddQuestion.css
│   ├── QuestionCard.css
│   ├── Quiz.css
│   └── QuizActions.css
├── App.jsx               # Main app shell
├── App.css               # Layout styles
├── index.css             # Global styles
└── main.jsx              # React entry point

server.js                 # Express API for reading/writing quiz data
```

## Technologies Used

- React
- Vite
- Express
- CSS
- JSON file storage

## Notes

- If you want to share a quiz, share the `public/questions.json` file.
