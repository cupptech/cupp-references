// check off specific Todos by clicking
/*
$('li').click(function(){
	
	// $(this).css('color', 'gray');
	// $(this).css('text-decoration', 'line-through');

	if ($(this).css('color') === 'rgb(128, 128, 128'){
		$(this).css({
			color: 'black',
			textDecoration: 'none'
		});
	} else {
		$(this).css({
			color: 'gray',
			textDecoration: 'line-through'
		});
	}

	$(this).toggleClass('completed');
});
*/

// add event listener on parent, so works for new todo item
$('ul').on('click', 'li', function(){
	$(this).toggleClass('completed');
});

/*
// click on X to delete Todo
$('span').click(function(event){
	console.log('clicked on span');	
	event.stopPropagation();
	// using parent() to retrieve li element
	$(this).parent().fadeOut(500, function(){
		// the two 'this' is different
		$(this).remove();
	});
});
*/

$('ul').on('click', 'span',function(event){
	event.stopPropagation();
	// using parent() to retrieve li element
	$(this).parent().fadeOut(500, function(){
		// the two 'this' is different
		$(this).remove();
	});
});


// event propagation
$('ul').click(function(){
	console.log('clicked on ul');	
});

$('#container').click(function(){
	console.log('clicked on container div');	
});

$('body').click(function(){
	console.log('clicked on body');	
});

$('input[type="text"]').keypress(function(event){
	if (event.which === 13) {
		console.log('You hit enter.');
		// create new todo item
		var todoText = $(this).val();
		$(this).val('');
		$('ul').append('<li><span><i class="fa fa-trash"></i></span> ' + todoText + '</li>');
	}
});

$('.fa-plus').click(function(){
	$('input[type="text"]').fadeToggle();
});