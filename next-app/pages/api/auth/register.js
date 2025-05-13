import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../lib/session'
import { createUser, findUserByUsername } from '../../../lib/users'

export default withIronSessionApiRoute(async function registerRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }
    
    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    
    // Check if username already exists
    if (findUserByUsername(username)) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Create user
    const user = createUser({ username, password })
    
    // Save user to session
    req.session.user = user
    await req.session.save()
    
    return res.status(201).json(user)
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: error.message || 'Internal server error' })
  }
}, sessionOptions)