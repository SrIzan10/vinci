import mongoose from 'mongoose'
const schema = new mongoose.Schema({ 
	id: {type: String, required: true},
	user: {type: String, required: true}
});
const db = mongoose.model('twitter', schema, 'twitter');
export default db