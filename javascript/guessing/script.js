// create secret number
var secretNumber = 4;

// ask user for guess, String value
var guess = Number(prompt('Guess a number'));

// check if guess is right
if (guess === secretNumber) {
	alert('You got it right!')
}
// check if higher
else if (guess > secretNumber) {
	alert('Too high, guess again.');
} 
// otherwise, lower
else {
	alert('Too low, guess again.');
}
