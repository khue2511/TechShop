import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next)  {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err: any) {
      console.error('Error hashing password:', err); 
      next(err)
    }
  } else {
    next()
  }
})

export default mongoose.model('User', UserSchema);
