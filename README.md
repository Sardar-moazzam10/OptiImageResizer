# OptiImageResizer 🖼️

A modern, professional image resizing tool built with React, TypeScript, and Express. Perfect for optimizing images for social media, web, and print.

## ✨ Features

- **Smart Resizing**: Lossless image resizing with advanced algorithms
- **Social Media Ready**: Preset dimensions for popular platforms (Instagram, Facebook, Twitter)
- **Batch Processing**: Resize multiple images simultaneously
- **Format Support**: JPG, JPEG, PNG, WebP, and GIF formats
- **Quality Control**: Adjust image quality and compression
- **Modern UI**: Clean, responsive interface with dark mode support
- **Real-time Preview**: See changes instantly
- **Secure**: Built-in authentication and secure file handling

## 🚀 Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Query
  - Radix UI Components

- **Backend**:
  - Express.js
  - PostgreSQL
  - Drizzle ORM
  - Sharp (Image Processing)
  - WebSocket (Real-time updates)

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 16.x
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/optisizer.git
   cd optisizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/optisizer
   SESSION_SECRET=your_session_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:5000
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Authentication**:
   - Register a new account or log in
   - Secure session management with automatic timeout

2. **Image Upload**:
   - Drag and drop or select files
   - Supports multiple file formats
   - Maximum file size: 10MB

3. **Resizing Options**:
   - Choose from preset dimensions
   - Custom width and height
   - Maintain aspect ratio
   - Adjust quality settings

4. **Export**:
   - Select output format
   - Download individual or batch files
   - Preview before saving

## 🔧 Configuration

Key settings in `client/src/lib/constants.ts`:
- Maximum file size
- Supported formats
- Default image quality
- Session timeout
- API endpoints

## 🧪 Development

- **Frontend Development**:
  ```bash
  cd client
  npm run dev
  ```

- **Backend Development**:
  ```bash
  npm run dev
  ```

- **Database Migrations**:
  ```bash
  npm run db:push
  ```

## 📦 Production Build

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://orm.drizzle.team/) for database management

## 📞 Support

For support, email support@optisizer.com or open an issue in the repository.

---

Made with ❤️ by [Your Name] 