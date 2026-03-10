# 🌱 Fyto - Plant Care Social Platform

Fyto is a comprehensive plant care social platform that combines social networking with plant care management, gamification, and a marketplace for plant enthusiasts. Connect with fellow plant lovers, track your plant care journey, participate in challenges, and grow your green thumb!

**🚀 Live Demo:** [https://fyto-virid.vercel.app/](https://fyto-virid.vercel.app/)

## ✨ Key Features

### 🌿 Social Networking
- **Community Feed**: Share your plant photos, care tips, and gardening experiences
- **Comments & Interactions**: Engage with other plant enthusiasts through comments and likes
- **User Profiles**: Showcase your plant collection and achievements
- **Follow System**: Connect with other plant lovers

### 📔 Plant Care Journal
- **Personal Diary**: Document your plant care journey with text and images
- **Track Growth**: Monitor your plants' progress over time
- **Care Logs**: Record watering schedules, fertilization, and other care activities

### 🎯 Challenges & Gamification
- **Daily Challenges**: Complete daily plant care tasks to earn points
- **Extra Challenges**: Take on special challenges for bonus rewards
- **Leaderboard**: Compete with other users and climb the rankings
- **Achievement System**: Earn badges and achievements for your plant care milestones
- **Points & Rewards**: Accumulate points through activities and challenges

### 🛒 Marketplace
- **Buy & Sell**: Trade plants, seeds, pots, and gardening supplies
- **Listings Management**: Create and manage your product listings
- **Automated Cleanup**: Expired listings are automatically removed

### 🌺 Plant Information & Care
- **Plant Database**: Access comprehensive plant care information
- **Plant Identification**: Identify plants using AI-powered image recognition
- **Care Guidelines**: Get detailed care instructions for different plant species
- **AI-Powered Quiz**: Test your plant knowledge with AI-generated quizzes

### 📢 Administrative Features
- **Admin Dashboard**: Manage users, posts, and content
- **Content Moderation**: Review and handle reported content
- **User Management**: Monitor and manage user activities

### 🔔 Notifications
- Real-time notifications for interactions, challenges, and updates

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Firebase** - Image storage and authentication
- **React Scripts** - Build tooling

### Backend
- **Node.js** - Runtime environment
- **Express** (v5.1.0) - Web application framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### External APIs & Services
- **Google Gemini AI** - Quiz generation and AI-powered features
- **PlantNet API** - Plant identification from images
- **Perenual API** - Plant care information database
- **Trefle API** - Additional plant data
- **Firebase Storage** - Image hosting

### Development Tools
- **Express Validator & Joi** - Request validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Fyto
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Install Client Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Install Server Dependencies
```bash
cd server
npm install
cd ..
```

## 🏃 Running the Application

### Development Mode

#### Start the Server (Terminal 1)
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

#### Start the Client (Terminal 2)
```bash
cd client
npm start
```
The client will run on `http://localhost:3000`

### Production Build

#### Build the Client
```bash
cd client
npm run build
```

## 🎮 How to Use

### For New Users

1. **Sign Up**: Create an account on the landing page
2. **Complete Profile**: Add your profile picture and bio
3. **Explore Feed**: Browse posts from the community
4. **Start Journal**: Begin documenting your plant care journey
5. **Take Challenges**: Complete daily challenges to earn points
6. **Browse Marketplace**: Explore plants and supplies for sale
7. **Identify Plants**: Use the plant identification feature to learn about new plants

### For Plant Enthusiasts

1. **Share Your Journey**: Post photos and updates about your plants
2. **Engage with Community**: Comment and like other users' posts
3. **Track Your Plants**: Maintain a detailed journal for each plant
4. **Climb the Leaderboard**: Complete challenges and earn achievements
5. **Learn**: Access plant care guides and information
6. **Trade**: Buy and sell plants and gardening supplies

### For Admins

1. **Login as Admin**: Use admin credentials to access the admin panel
2. **Monitor Content**: Review posts and user activities
3. **Handle Reports**: Manage reported content and user complaints
4. **Manage Users**: View and manage user accounts

Ensure all environment variables are properly configured in your deployment platform.

## 🤝 Contributing

This project was developed as part of an academic project. Contributions, issues, and feature requests are welcome!

## 👥 Team

- **Nafisa Tasnim**
- **Nishat Tasnim**
- **Mrittika Jahan**


## 🙏 Acknowledgments

- Thanks to all the open-source libraries and APIs used in this project
- Plant care community for inspiration and feedback
- Academic institution for project support

---

**Happy Planting! 🌱**

Made with 💚 by the Fyto Team
