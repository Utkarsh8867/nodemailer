# Authentication Backend with Node.js

This project is a backend implementation for user authentication, built with Node.js. It provides essential features like user login, signup, password recovery, email verification, and email notifications using Nodemailer. Note: The project currently focuses on backend functionality and does not include a frontend.

## Features
- **Login Page**: Authenticate users with their credentials.
- **Signup Page**: Allow users to create a new account.
- **Forgot Password**: Enable users to reset their password securely.
- **Email Verification**: Send verification emails to users for account confirmation.
- **Nodemailer Integration**: Handle email communication for password recovery and account verification.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **Nodemailer**: For sending emails like account verification and password recovery.
- **Database**: (Mention your database here, e.g., MongoDB, MySQL, etc.)

## How to Use
1. Clone the repository.
2. Set up the required environment variables in the `back.env` file:
   - `EMAIL_HOST`: Your SMTP server host.
   - `EMAIL_PORT`: SMTP server port.
   - `EMAIL_USER`: Your email username.
   - `EMAIL_PASS`: Your email password.
   - (Add any other required variables like database connection details.)
3. Install dependencies:
   ```bash
   npm install

