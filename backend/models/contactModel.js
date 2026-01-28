import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;