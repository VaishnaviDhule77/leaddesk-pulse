import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string; email: string; budget_range: string;
  message: string; status: 'New' | 'Contacted' | 'Closed'; createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email.'] },
    budget_range: { type: String, required: true, enum: ['$1k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'] },
    message: { type: String, default: '', maxlength: 2000 },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);