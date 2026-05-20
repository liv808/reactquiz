// Utility function to shuffle an array using Fisher-Yates algorithm
export const shuffleArray =
	( array ) => {
		const shuffled = [...array];
		for ( let i = shuffled.length - 1; i > 0; i-- )
		{
			const j = Math.floor( Math.random() * ( i + 1 ) );
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
		}
		return shuffled
	}

// Shuffle questions
export const shuffleQuestions = ( questions ) => { return shuffleArray( questions )}

// Shuffle answers and return new question object with updated correct answer index
export const shuffleAnswers = ( question ) => {
	const answersWithIndices = question.answers.map( ( answer, index ) => ( { answer, originalIndex: index } ) )

	const shuffled = shuffleArray( answersWithIndices )

	// Find the new index of the correct answer
	const newCorrectIndex = shuffled.findIndex( ( item ) => item.originalIndex === question.correct )

	return {
		...question,
		answers: shuffled.map( ( item ) => item.answer ),
		correct: newCorrectIndex
	}
}
