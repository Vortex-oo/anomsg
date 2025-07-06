# Anomsg

Anomsg is a full-stack Next.js application that allows users to sign up, sign in, and receive anonymous messages via a unique profile link. The project features user authentication, password reset, email verification, and a dashboard for managing received messages.

---

## Features

- **User Authentication:** Sign up, sign in, and JWT-based session management using NextAuth.js.
- **Anonymous Messaging:** Share your unique profile link and receive messages from anyone.
- **Dashboard:** View, refresh, and manage received messages.
- **Password Reset:** Secure password reset flow with email verification.
- **Email Verification:** Email templates for signup and password reset, sent via Resend.
- **Message Acceptance Toggle:** Users can enable/disable receiving messages.
- **Modern UI:** Responsive, dark-themed interface with quirky accent colors.
- **Tech Stack:** Next.js 14 (App Router), MongoDB (Mongoose), NextAuth.js, Zod, Tailwind CSS, Resend.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (local or Atlas)
- [Resend](https://resend.com/) account for email sending

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/anomsg.git
   cd anomsg
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add:

   ```
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_nextauth_secret
   RESEND_EMAIL_API_KEY=your_resend_api_key
   NEXTAUTH_URL=http://localhost:3000
   ```

   > Generate a strong `AUTH_SECRET` with:  
   > `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Project Structure

```
src/
  app/
    (auth)/         # Authentication pages (signup, signin, reset password)
    dashboard/      # User dashboard
    sendmessage/    # Public message sending page
    api/            # API routes (Next.js App Router)
  components/       # Reusable UI components
  models/           # Mongoose models (User, Message)
  helpers/          # Helper functions (email sending, etc.)
  schemas/          # Zod validation schemas
lib/
  db.ts             # MongoDB connection
  resend.ts         # Resend email client
auth.ts             # NextAuth.js configuration
```

---

## Key Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm start` – Start the production server

---

## Customization

- **Colors & Theme:**  
  Edit Tailwind config or component classes for your brand colors.
- **Email Templates:**  
  Modify `src/components/email.tsx` and `src/components/emailTemplateReset.tsx` for your own branding and copy.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Resend](https://resend.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)

---

**Made with ❤️ for anonymous messaging!**