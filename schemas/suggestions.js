import mongoose from 'mongoose'
const schema = new mongoose.Schema({ 
	msgid: {type: String, required: true},
	userid: {type: String, required: true},
});
const db = mongoose.model('suggestions', schema, 'suggestions');
export default db