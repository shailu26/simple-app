const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, default: null},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    jobTitle: {type:String},
    photo: {type:String, default: null}
});

export default mongoose.model('User', UserSchema);