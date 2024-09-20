import mongoose from 'mongoose'
const schema = new mongoose.Schema({ 
	id: {type: String, required: true},
	user: {type: String, required: true},
	suggestionid: {type: String, required: true},
	suggestion: {type: String, required: true},
});
const db = mongoose.model('padyama', schema, 'padyama');
export default db