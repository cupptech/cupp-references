// Return the average of an array
function average(scores) {
	// add all scores together
	var total = 0;
	scores.forEach(function(score){
		total += score;
	});
	// divide by total number of scores
	var avg = total/scores.length;
	// round avarage
	return Math.round(avg);
}

var scores = [90,98,89,100,100,86,94];
console.log(average(scores));
