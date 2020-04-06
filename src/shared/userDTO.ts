import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String, required: false },
  password: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  role: { type: String, required: true },
});

export interface UserDTO {
  name: string;
  id?: string;
  email: string;
  profileImage?: string;
  password: string;
  mobileNumber: number;
  role: string;
}

export interface User extends mongoose.Document {
  name: string;
  id?: string;
  email: string;
  profileImage?: string;
  password: string;
  mobileNumber: number;
  role: string;
}
