import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../lib/session'

export default withIronSessionApiRoute(function logoutRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  
  req.session.destroy()
  res.status(200).end()
}, sessionOptions)