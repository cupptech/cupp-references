var todos = ['Buy new laptop'];

var input = prompt('What would you like to do?');

while(input !== 'quit'){
	// handle input
	if (input === 'list') {
		listTodos();
	} else if (input === 'new') {
		// ask for new todo
		var newTodo = prompt('Please enter new todo');
		todos.push(newTodo);
		console.log('Added Todo');
	} else if (input === 'delete') {
		// ask for index of todo to be deleted
		var index = prompt('Enter index of todo to delete');
		// delete that todo
		todos.splice(index, 1); 
		console.log('Deleted Todo');
	}
	// ask again for new input
	input = prompt('What would you like to do?');
}

console.log('OK, You quit the app.');

function listTodos() {
	//console.log(todos);
	console.log('**********');
	todos.forEach(function(todo, i){
		console.log(i + ': ' + todo);
	});
	console.log('**********');
}

