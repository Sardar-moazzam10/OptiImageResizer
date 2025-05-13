import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'

export default withIronSessionApiRoute(async function userRoute(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  if (req.session.user) {
    // Return the user without the password
    const { password, ...userWithoutPassword } = req.session.user
    return res.json(userWithoutPassword)
  }
  
  return res.status(401).end()
}, sessionOptions)