# MailCleanse

**Effortlessly Tame Your Inbox: Identify, Manage, and Unsubscribe from Email Subscriptions.**




## ✨ Overview

MailCleanse is a powerful and intuitive web application designed to help you regain control over your cluttered email inbox. By leveraging the Google Gmail API, MailCleanse intelligently scans your emails to identify legitimate subscription services and provides you with an easy-to-use interface to manage or unsubscribe from them. Say goodbye to unwanted newsletters and promotions taking over your digital space!

## 🚀 Features

* **Intelligent Subscription Detection:** Scans your Gmail inbox to identify email subscriptions based on common patterns and "List-Unsubscribe" headers.
* **Centralized Management:** View all your detected subscriptions in one clean dashboard.
* **One-Click Unsubscribe:** Effortlessly unsubscribe from services directly from the MailCleanse interface (supports both web links and mailto-based unsubscribes).
* **Google OAuth Authentication:** Secure and seamless login using your Google account.
* **User Dashboard:** Personal dashboard showing total subscriptions, unsubscribe count, and last scan date.
* **Responsive Design:** A clean, modern, and mobile-friendly user interface.

## 💻 Technologies Used

MailCleanse is built with a robust and modern technology stack:

**Frontend:**

* **Next.js 14+ (App Router):** A React framework for building fast and scalable web applications.
* **React:** For building interactive user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Axios:** Promise-based HTTP client for making API requests.
* **Lucide React:** Beautifully simple and customizable open-source icons.

**Backend:**

* **Node.js:** JavaScript runtime.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **Passport.js:** Authentication middleware for Node.js, specifically `passport-google-oauth20` for Google OAuth.
* **Mongoose:** MongoDB object modeling for Node.js.
* **MongoDB:** NoSQL database for storing user data and subscription details.
* **express-session & connect-mongo:** For session management and storing sessions in MongoDB.
* **Google APIs (googleapis):** Interacting with the Gmail API.
* **dotenv:** For loading environment variables.
