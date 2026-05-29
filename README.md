```markdown
# 🌱 Agri-Chain Backend

# 🌐 Live Demo: https://int-222-project-eight.vercel.app

Agri-Chain is a robust Node.js and MongoDB backend system designed to manage secure user authentication, role-based access, and seamless onboarding for digital farming solutions. 

This repository houses the core REST APIs, featuring a fully functional email-based OTP verification system built to bypass standard SMTP firewalls using external HTTP APIs.

## ✨ Features

* **Secure User Authentication:** End-to-end user registration and login workflows.
* **Email Verification:** Automated 4-digit OTP delivery to user inboxes using the Mailtrap API.
* **Password Cryptography:** Industry-standard password hashing utilizing `bcryptjs`.
* **Stateless Sessions:** Secure route protection and authorization using JSON Web Tokens (JWT).
* **Cloud-Ready:** Configured for seamless deployment on platforms like Render or Vercel, integrated with MongoDB Atlas.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas & Mongoose
* **Authentication:** JSON Web Tokens (JWT)
* **Security:** bcryptjs
* **Email Service:** Mailtrap (HTTP API via native `fetch`)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
* A [Mailtrap](https://mailtrap.io/) account

### Installation

1. **Clone the repository:**
   
```bash
   git clone [https://github.com/YourUsername/Agri-Chain.git](https://github.com/YourUsername/Agri-Chain.git)
   cd Agri-Chain/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys. Do NOT commit this file to GitHub!
   ```env
   # Database Configuration
   MONGO_URI=your_mongodb_atlas_connection_string

   # JWT Security
   JWT_SECRET=your_super_secret_jwt_key

   # Email Service (Mailtrap Sending Token)
   MAILTRAP_TOKEN=your_mailtrap_api_token
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   *The server will start running on `http://localhost:5000`*

## 🛣️ API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new user (unverified) and sends an OTP to their email. | No |
| `POST` | `/api/auth/verify-otp` | Validates the OTP and sets the user's status to verified. Returns a JWT. | No |
| `POST` | `/api/auth/login` | Authenticates the user and returns a JWT. | No |
| `GET` | `/api/auth/me` | Retrieves the currently logged-in user's profile data. | Yes |

## 📦 Project Structure
```text
📦 backend
 ┣ 📂 src
 ┃ ┣ 📂 controllers
 ┃ ┃ ┗ 📜 auth.controller.js    # Core authentication & email logic
 ┃ ┣ 📂 models
 ┃ ┃ ┗ 📜 User.js               # Mongoose schema for the User collection
 ┃ ┣ 📂 routes
 ┃ ┃ ┗ 📜 auth.routes.js        # API route definitions
 ┃ ┗ 📜 server.js               # Entry point and Express configuration
 ┣ 📜 .env                      # Environment variables (Ignored by Git)
 ┣ 📜 .gitignore
 ┣ 📜 package.json
 ┗ 📜 README.md
```

## 🔐 Deployment Notes

When deploying to a cloud provider like Render:
1. Ensure the Node version in your environment matches your local setup.
2. Add all variables from your `.env` file into the platform's Environment Variables dashboard.
3. Ensure the `MAILTRAP_TOKEN` used is the **Sending API Token**, not the Testing Sandbox token.
