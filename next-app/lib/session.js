// Session configuration for iron-session
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'optisizer-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}