# SecureShare - Secure File Sharing System

A powerful, secure file sharing system built with the MERN stack (minus React) using EJS templating, following strict MVC architecture with advanced AI features.

## 🚀 Features

### Core Features
- **Vault Creation**: Create secure vaults with unique IDs for organized file sharing
- **Multi-File Upload**: Upload multiple files with drag-and-drop interface
- **Secure Access**: Access vaults using unique Vault IDs
- **File Management**: Download, delete, and track file usage

### AI-Powered Features
- **Automatic Compression**: Large files are automatically compressed before upload
- **Link Expiry**: Set expiration dates for vaults and files (hours to days)
- **Download Limits**: Configure maximum downloads per vault or file
- **Usage Tracking**: Monitor download counts and vault activity

### Security Features
- **GridFS Storage**: Secure file storage using MongoDB GridFS
- **Rate Limiting**: Protection against abuse with request rate limiting
- **Helmet Security**: Security headers and content security policy
- **File Validation**: Comprehensive file type and size validation
- **Cross-Platform**: Works seamlessly across all devices and platforms

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB Atlas**: Database with GridFS for file storage
- **Mongoose**: ODM for MongoDB

### Frontend
- **EJS**: Templating engine
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Interactive features
- **Font Awesome**: Icons

### Additional Libraries
- **Multer**: File upload handling
- **Compression**: Response compression
- **Moment.js**: Date/time formatting
- **Crypto**: Secure random ID generation
- **Helmet**: Security middleware

## 📁 Project Structure (MVC Architecture)

```
├── config/
│   └── connection.js      # MongoDB connection setup
├── controllers/
│   ├── vaultController.js # Vault management logic
│   └── fileController.js  # File operations logic
├── middleware/
│   └── upload.js          # File upload and compression middleware
├── models/
│   ├── Vault.js           # Vault schema
│   └── File.js            # File schema
├── routes/
│   ├── index.js           # Main application routes
│   └── vault.js           # Vault-specific routes
├── views/
│   ├── layout.ejs         # Main layout template
│   ├── index.ejs          # Homepage
│   ├── create.ejs         # Vault creation
│   ├── access.ejs         # Vault access
│   ├── vault.ejs          # Vault management
│   ├── about.ejs          # About page
│   └── error.ejs          # Error page
├── public/
│   └── uploads/           # Temporary upload directory
├── .env                   # Environment variables
├── server.js              # Main server file
└── package.json           # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with the following variables:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/filesharingdb?retryWrites=true&w=majority
   DB_NAME=filesharingdb

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Security
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production

   # File Storage
   MAX_FILE_SIZE=50000000
   UPLOAD_PATH=uploads/
   ```

3. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas cluster
   - Create a database user with read/write permissions
   - Whitelist your IP address
   - Replace the connection string in `.env`

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 💡 Usage

### Creating a Vault
1. Navigate to "Create Vault"
2. Enter vault name and optional description
3. Set expiry time (optional)
4. Set download limits (optional)
5. Click "Create Vault"
6. Save the generated Vault ID for sharing

### Uploading Files
1. Access your vault using the Vault ID
2. Drag and drop files or click to select
3. Files are automatically compressed if > 1MB
4. Click "Upload Files"
5. Files are stored securely in GridFS

### Sharing Files
1. Share the Vault ID with others
2. Recipients can access the vault using "Access Vault"
3. Files can be downloaded individually
4. Download counts are tracked automatically

### Advanced Features
- **Expiry**: Vaults and files automatically expire based on set dates
- **Limits**: Downloads are restricted based on configured limits
- **Compression**: Large files are automatically compressed
- **Security**: All operations are logged and rate-limited

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Validation**: Size and type restrictions
- **Secure Headers**: Helmet.js security middleware
- **GridFS Storage**: Encrypted file storage
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: Secure error messages without information leakage

## 🚀 Deployment

The application is designed to be deployed on any Node.js hosting platform:

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git or GitHub integration

### Docker Deployment
1. Create a Dockerfile
2. Build and run the container
3. Configure environment variables

### VPS Deployment
1. Set up Node.js on your server
2. Configure MongoDB Atlas connection
3. Use PM2 for process management
4. Set up reverse proxy with Nginx

## 📊 Performance Optimization

- **Compression**: Gzip compression for all responses
- **File Compression**: Automatic compression for large files
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Static file caching
- **GridFS**: Efficient large file storage

## 🔧 Configuration

### File Upload Limits
- Maximum file size: 50MB per file
- Maximum files per upload: 10 files
- Supported formats: All file types

### Database Configuration
- Connection pooling enabled
- Automatic reconnection
- GridFS for file storage
- TTL indexes for automatic cleanup

### Security Configuration
- Rate limiting: 100 requests/15 minutes
- CORS protection
- XSS protection
- Content Security Policy

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user permissions

2. **File Upload Fails**
   - Check file size limits
   - Verify disk space
   - Check network connectivity

3. **Vault Not Found**
   - Verify Vault ID format (32-character hex)
   - Check if vault has expired
   - Ensure vault is still active

## 📝 API Documentation

### Vault Endpoints
- `POST /vault/create` - Create new vault
- `GET /vault/:vaultId` - Access vault
- `POST /vault/access` - Access vault by ID

### File Endpoints
- `POST /vault/:vaultId/upload` - Upload files
- `GET /vault/file/:fileId/download` - Download file
- `DELETE /vault/file/:fileId` - Delete file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

Built with ❤️ using the MERN stack and modern web technologies.