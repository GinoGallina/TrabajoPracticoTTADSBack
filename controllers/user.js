import User from '../models/database/user.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).select('email address');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error getting Users' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.find({user_id: req.params.id});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'User not found' });
    }
  },
  loginUser: async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Error during login' });
    }
  },


createUser: async (req, res) => {
  try {
    const { username, email, type, password, address } = req.body;

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      type,
      password: hashedPassword,
      address,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User created', data: savedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
},

updateUserById: async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { user_id: req.params.id }, 
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
},

  deleteUserById: async (req, res) => {
    try {
      const userToDelete = await User.findOne({ user_id: req.params.id });

      if (!userToDelete) {
        return res.status(404).json({ error: 'User not found' });
      }

      await User.deleteOne({ user_id: req.params.id });
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  },
};

export default userController;
