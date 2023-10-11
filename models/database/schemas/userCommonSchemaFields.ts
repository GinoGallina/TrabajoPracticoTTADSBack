export const commonSchemaFields = {
  userId: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
  },
  username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  type: { type: String, required: true },
  password: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  state: { type: String, default: 'Active' },
};