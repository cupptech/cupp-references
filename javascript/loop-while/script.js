console.log('1. Print all numbers between -10 and 19');
var count = -10;
while (count < 20) {
	console.log(count);
	count++;
}

console.log('2. Print all even numbers between 10 and 40');
var count = 10;
while (count <= 40) {
	console.log(count);
	count+=2;
}

console.log('3. Print all odd numbers between 300 and 333');
var count = 300;
while (count <= 333) {
	if (count % 2 !== 0){
		console.log(count);
	}
	count++;
}

console.log('4. Print all numbers divisions by 5 AND 3 between 5 and 50 ');
var count = 5;
while (count <= 50) {
	if (count % 5 === 0 && count % 3 === 0){
		console.log(count);
	}
	count++;
}
