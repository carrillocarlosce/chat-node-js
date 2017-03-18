var mongo = require('mongoose');
var Schema = mongo.Schema; 

var password_validation = {
	 		validator: function(p) {
	 			return this.password_confirmation == p;
	 		},
	 		message: 'Las contraseñas no son iguales'
	 	}

var user_schema = new Schema({
	 name: String,
	 username: {
	 	type: String,
	 	required: true,
	 	maxlength: [50, 'El nombre de usuario no puede tener mas de 50 caracteres']
	 },
	 password: {
	 	type: String,
	 	minlength: [8, 'La contraseña debe ser de almenos 8 caracteres'],
	 	validate: password_validation
	 },
	 email: {
	 	type: String,
	 	required: 'El correo es obligatorio',
	 }
});

user_schema.virtual('password_confirmation').get(function(argument) {
	return this.p_c;
}).set(function(password) {
	this.p_c = password;
})


var User = mongo.model('User', user_schema);

module.exports.User = User;