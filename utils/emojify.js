/**
 * Converts a string into its emoji representation.
 * @param {*} content - The content to convert.
 * @returns {string} - The emoji representation of the content.
 */
export function Emojify(content) {
	content = content.toLowerCase().split("")

	content = content.map((letter) => {
		if (/[a-z]/g.test(letter)) return `:regional_indicator_${letter}:`
		else if (this.chars[letter]) return this.chars[letter]
		else return letter
	})

	return content.join("")
}

export const chars = {
	0: ":zero:",
	1: ":one:",
	2: ":two:",
	3: ":three:",
	4: ":four:",
	5: ":five:",
	6: ":six:",
	7: ":seven:",
	8: ":eight:",
	9: ":nine:",
	"#": ":hash:",
	"*": ":asterisk:",
	"?": ":grey_question:",
	"!": ":grey_exclamation:",
	"+": ":heavy_plus_sign:",
	"-": ":heavy_minus_sign:",
	"×": ":heavy_multiplication_x:",
	"*": ":asterisk:",
	$: ":heavy_dollar_sign:",
	"/": ":heavy_division_sign:",
	" ": "   ",
}
