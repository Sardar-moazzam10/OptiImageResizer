import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../lib/session'
import { verifyLogin } from '../../../lib/users'

export default withIronSessionApiRoute(async function loginRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = verifyLogin(username, password)
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    
    // Save user to session
    req.session.user = user
    await req.session.save()
    
    return res.status(200).json(user)
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}, sessionOptions)