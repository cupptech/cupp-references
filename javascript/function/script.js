
/*
function isEven(num) {
	// return true if even
	if (num % 2 === 0) {
		return true;
	} else {
		return false;
	}
}
*/

function isEven(num){
	return num % 2 === 0;
}


function factorial(num) {
	// define a result variable
	var result = 1; 	// !0 = 1 

	// calculate factorial and store value in result
	for (var i = 2; i <= num; i++) {
		result *= i;
	}

	// return the result variable
	return result;
}

// replace all '-' with '_'
function kebabToSnake(str) {
	return str.replace(/-/g, '_');
}