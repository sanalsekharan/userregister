var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id: Schema.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    googleId: String,
    userPhoto: String,
    emailVarified: Boolean,
    randomNumber: Number,
    loginCode: String
});
module.exports = mongoose.model('User', userSchema);
