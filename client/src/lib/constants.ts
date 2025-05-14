// App Configuration
export const APP_CONFIG = {
  name: "Optisizer",
  description: "Professional Image Resizing Tool",
  version: "1.0.0",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://optisizer.com",
  supportEmail: "support@optisizer.com",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ["jpg", "jpeg", "png", "webp", "gif"] as const,
  defaultImageQuality: 90,
  defaultFormat: "jpg" as const,
  defaultDimensions: {
    width: 800,
    height: 600,
  },
  defaultScale: 100,
  minUsernameLength: 3,
  minPasswordLength: 6,
  maxUsernameLength: 30,
  maxPasswordLength: 100,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/optisizer",
  github: "https://github.com/optisizer",
  instagram: "https://instagram.com/optisizer",
} as const;

// Feature List
export const FEATURES = [
  {
    id: "lossless",
    title: "Lossless Resizing",
    description:
      "Experience crystal-clear image quality with our advanced resizing algorithms. No compromise on quality.",
    icon: "Sparkles",
    color: "primary",
  },
  {
    id: "social",
    title: "Social Media Ready",
    description:
      "Perfect your images for any platform with our smart presets. Instagram, Facebook, Twitter - we've got you covered.",
    icon: "Zap",
    color: "yellow",
  },
  {
    id: "control",
    title: "Precise Control",
    description:
      "Take command of every pixel with our intuitive controls. Perfect dimensions, perfect results.",
    icon: "Shield",
    color: "green",
  },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  fileTooLarge: `File size must be less than ${
    APP_CONFIG.maxFileSize / (1024 * 1024)
  }MB`,
  invalidFormat: `File format must be one of: ${APP_CONFIG.supportedFormats.join(
    ", "
  )}`,
  uploadFailed: "Failed to upload image. Please try again.",
  resizeFailed: "Failed to resize image. Please try again.",
  invalidDimensions: "Invalid dimensions provided",
  invalidScale: "Scale must be between 1 and 1000",
  invalidCredentials: "Invalid username or password",
  usernameTaken: "Username is already taken",
  passwordsDontMatch: "Passwords do not match",
  sessionExpired: "Your session has expired. Please log in again.",
  networkError: "Network error. Please check your connection.",
  serverError: "Server error. Please try again later.",
  unauthorized: "You must be logged in to perform this action",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  uploadSuccess: "Image uploaded successfully",
  resizeSuccess: "Image resized successfully",
  loginSuccess: "Logged in successfully",
  registerSuccess: "Account created successfully",
  logoutSuccess: "Logged out successfully",
  saveSuccess: "Settings saved successfully",
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  username: {
    required: "Username is required",
    minLength: `Username must be at least ${APP_CONFIG.minUsernameLength} characters`,
    maxLength: `Username must be less than ${APP_CONFIG.maxUsernameLength} characters`,
    pattern: "Username can only contain letters, numbers, and underscores",
  },
  password: {
    required: "Password is required",
    minLength: `Password must be at least ${APP_CONFIG.minPasswordLength} characters`,
    maxLength: `Password must be less than ${APP_CONFIG.maxPasswordLength} characters`,
    pattern:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  },
  email: {
    required: "Email is required",
    pattern: "Please enter a valid email address",
  },
} as const;

// Routes
export const ROUTES = {
  home: "/",
  auth: "/auth",
  dashboard: "/dashboard",
  settings: "/settings",
  notFound: "/404",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: "/api/login",
    register: "/api/register",
    logout: "/api/logout",
    refresh: "/api/user"
  },
  images: {
    upload: "/api/images/upload",
    resize: "/api/images/resize",
    list: "/api/images",
    delete: "/api/images/:id",
  },
  user: {
    profile: "/api/user/profile",
    settings: "/api/user/settings",
  },
} as const;
