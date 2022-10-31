import mongoose from 'mongoose'
const schema = new mongoose.Schema({ 
	id: {type: String, required: true},
	user: {type: String, required: true}
});
const db = mongoose.model('youtube', schema, 'youtube');
export default db