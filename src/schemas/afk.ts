import mongoose from 'mongoose'
const schema = new mongoose.Schema({ 
	id: {type: String, required: true},
	reason: {type: String, required: true},
});
const db = mongoose.model('afk', schema, 'afk');
export default db