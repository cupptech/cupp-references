var faker = require('faker');

for (var i = 0; i < 10; i++){
	var name = faker.commerce.productName();
	var price = faker.commerce.price();
	console.log(name + " - $" + price);	
}
