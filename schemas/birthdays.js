import mongoose from 'mongoose'
const schema = new mongoose.Schema({ 
	id: {type: String, required: true},
	date: {type: String, required: true},
	alreadysent: {type: Boolean, required: true},
});
const db = mongoose.model('birthday', schema, 'birthdays');
export default db