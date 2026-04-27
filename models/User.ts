import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ISavedAddress {
  label: string; // "Home", "Office"
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'SUPERADMIN' | 'VENDOR' | 'CUSTOMER';
  isBlocked?: boolean;
  image?: string;
  savedAddresses?: ISavedAddress[];
  wishlist?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['SUPERADMIN', 'VENDOR', 'CUSTOMER'],
      default: 'CUSTOMER',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    savedAddresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
      }
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }]
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
