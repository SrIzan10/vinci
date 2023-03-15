import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
	role: { type: String, required: true },
	content: { type: String, required: true },
});
const schema = new mongoose.Schema({
	messageid: { type: String, required: true },
	threadid: { type: String, required: true },
	messages: { type: [messageSchema], required: true },
});
const db = mongoose.model('chatgpt', schema, 'chatgpt');
export default db