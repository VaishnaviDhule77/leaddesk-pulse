# LeadDesk pulse 🚀

> A lightweight, secure lead-capture and management portal built for the **Digital Heroes Internship Qualification Task**.

---

## 📌 Features

- **Public Lead Form**: Client-side and server-side validation for lead submissions (`Name`, `Email`, `Budget Range`, `Message`).
- **Admin Authentication**: JWT-based authentication using `jose` with HttpOnly cookies and Next.js Edge Middleware.
- **Admin Dashboard**: Real-time management interface to search leads and toggle lead status (`New`, `Contacted`, `Closed`).
- **Database**: Persistent storage backed by MongoDB and Mongoose.
- **Responsive UI**: Styled using Tailwind CSS.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 14 (App Router, TypeScript)
* **Database**: MongoDB & Mongoose
* **Authentication**: JWT (`jose`) & Password Hashing (`bcryptjs`)
* **Styling**: Tailwind CSS
* **Deployment**: Netlify / Vercel
---

## ⚙️ Getting Started Locally

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/leaddesk-mini.git](https://github.com/YOUR_USERNAME/leaddesk-mini.git)
cd leaddesk-mini
