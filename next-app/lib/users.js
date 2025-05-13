// Simple in-memory user storage for the Next.js version
import CryptoJS from 'crypto-js'

// In-memory storage
let users = []
let userId = 1

// Hash password using CryptoJS
function hashPassword(password) {
  return CryptoJS.SHA256(password).toString()
}

// Find user by username
export function findUserByUsername(username) {
  return users.find(user => user.username === username)
}

// Find user by ID
export function findUserById(id) {
  return users.find(user => user.id === id)
}

// Create user
export function createUser(userData) {
  const existingUser = findUserByUsername(userData.username)
  if (existingUser) {
    throw new Error('Username already exists')
  }
  
  const newUser = {
    id: userId++,
    username: userData.username,
    password: hashPassword(userData.password),
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Verify login
export function verifyLogin(username, password) {
  const user = findUserByUsername(username)
  
  if (!user || user.password !== hashPassword(password)) {
    return null
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}