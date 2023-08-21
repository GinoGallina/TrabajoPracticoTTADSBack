import User from '../models/database/user.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js'
import { validatePartialUserUpdate, validateUser } from '../schemas/user.js'
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, '-_id email address userId state type')
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ error: 'Error getting Users' })
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.find({ userId: req.params.id }, '-_id email address userId state type')
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error: 'User not found' })
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect password' })
      }

      res.status(200).json({ message: 'Login successful' })
    } catch (error) {
      res.status(500).json({ error: 'Error during login' })
    }
  },

  createUser: async (req, res) => {
    try {
      const result = validateUser(req.body)
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(result.data.password, saltRounds)
      result.data.password = hashedPassword

      const newUser = new User(result.data)

      const { userId, email, username, type, state } = await newUser.save()
      const responseData = {
        userId,
        email,
        username,
        type,
        state
      }
      res.status(201).json({ message: 'User created', data: responseData })
    } catch (error) {
      res.status(500).json({ error: JSON.stringify(error) })
    }
  },

  updateUserById: async (req, res) => {
    try {
      const result = validatePartialUserUpdate(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
      if (result.data.password) {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(result.data.password, saltRounds)
        result.data.password = hashedPassword
      }
      const updatedUser = await User.findOneAndUpdate(
        { userId: req.params.id },
        result.data,
        { new: true }
      )
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.status(200).json(updatedUser)
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' })
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { userId: req.params.id },
        { state: 'Disable' },
        { new: true }
      )
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.status(200).json({ message: 'User deleted' })
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' })
    }
  }
}

export default userController
