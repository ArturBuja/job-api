import mongoose, { Document } from 'mongoose';

interface IJob extends Document {
  company: string;
  position: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
}

const JobSchema = new mongoose.Schema<IJob>(
  {
    company: {
      type: String,
      required: [true, 'Prosze wprowadzić nazwę firmy'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Prosze wprowadzić pozycję firmy'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Prosze wprowadzić nazwę użytkownika'],
    },
  },
  { timestamps: true }
);

export = mongoose.model<IJob>('Job', JobSchema);
