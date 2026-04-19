# 📇 NexusContact – Full‑Stack Contact Manager

A modern, secure contact management web application built with **Spring Boot 3**, **React + TypeScript**, **PostgreSQL**, and **Docker**. Features real‑time search, category filtering, CSV export, dark/light mode, and JWT authentication.


## ✨ Features

- 🔐 **JWT Authentication** – Secure login & registration
- 📇 **CRUD Operations** – Create, read, update, delete contacts
- 🔎 **Real‑time Search** – Instant filtering by name, email, or phone
- 🏷️ **Category Management** – Assign labels (Work, Family, etc.) and filter by them
- 📊 **Card & Table Views** – Toggle between visual layouts
- 🌙 **Dark / Light Mode** – Theme persistence via localStorage
- 📤 **CSV Export** – Download your contact list with one click
- 📱 **Fully Responsive** – Works on mobile, tablet, and desktop
- 🐳 **Dockerized** – One‑command setup with Docker Compose

## 🛠️ Tech Stack

| Frontend | Backend | Database | DevOps |
|----------|---------|----------|--------|
| React 18 + TypeScript | Spring Boot 3.2 | PostgreSQL 16 | Docker Compose |
| Vite | Spring Security + JWT | Flyway Migrations | Nginx (prod) |
| Tailwind CSS | Spring Data JPA | | |
| React Query | Hibernate | | |
| Zustand (state) | Lombok | | |
| React Hook Form | OpenCSV | | |

## 🚀 Quick Start (with Docker)

1. **Clone the repository:**
   `ash
   git clone https://github.com/yourusername/nexuscontact.git
   cd nexuscontact
   `

2. **Copy environment files:**
   `ash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   `

3. **Start with Docker Compose:**
   `ash
   docker compose up -d
   `

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080
   - Adminer (DB): http://localhost:8081

## 🏗️ Local Development

### Backend
`ash
cd backend
mvn spring-boot:run
`

### Frontend
`ash
cd frontend
npm install
npm run dev
`

## 📁 Project Structure
nexuscontact/
├── backend/ # Spring Boot API
├── frontend/ # React + TypeScript
├── docker-compose.yml # Docker orchestration
├── .gitignore # Git exclusions
└── README.md # This file## 🔐 Environment Variables

**backend/.env**

DB_URL=jdbc:postgresql://localhost:5432/contactdb
DB_USERNAME=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-here

text

**frontend/.env**
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=NexusContact

text

## 🧪 Testing

`ash
# Backend tests
cd backend && mvn test

# Frontend tests
cd frontend && npm run test
`

## 📦 Deployment

1. **Build Docker images:**
   `ash
   docker compose build
   `

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request


*Built with ❤️ using Spring Boot, React, and Docker*
