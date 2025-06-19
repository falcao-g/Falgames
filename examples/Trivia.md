# **❔ Trivia**

```js
const { Trivia } = require("falgames")

const Game = new Trivia({
	message: message,
	isSlashGame: false,
	embed: {
		title: "Trivia",
		color: "#551476",
		description: "Your time to answer is going to end {timeoutTime}.",
	},
	timeoutTime: 60000,
	buttonStyle: "PRIMARY",
	trueButtonStyle: "SUCCESS",
	falseButtonStyle: "DANGER",
	mode: "multiple", // multiple || single
	difficulty: "medium", // easy || medium || hard
	winMessage: "You won! The correct answer is {answer}.",
	loseMessage: "You lost! The correct answer is {answer}.",
	errMessage: "Unable to fetch question data! Please try again.",
	playerOnlyMessage: "Only {player} can use these buttons.",
	categoryText: "Category",
	difficultyText: "Difficulty",
})

Game.startGame()
Game.on("gameOver", (result) => {
	console.log(result) // =>  { result... }
})
```
