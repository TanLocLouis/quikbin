# 📋 Project Overview

This is my pet project offers a fast and lightweight solution for storing and sharing temporary content, similar to **Pastebin**.

---

# 🛠️ Technologies Used

- **Node.js** + **ExpressJS** – Backend server
- **React.js** – Web frontend
- **MongoDB** – Primary data storage
- **Docker** – Containerized deployment
- **Redis** *(optional)* – Caching layer for enhanced performance
- **GitHub CI/CD** (optional) – Automated build and deployment pipelines (Not implemented yet :D)

---

# Getting Started

## Quick Setup
- **NodeJS** and **npm**
- **MongoDB** run on local or using **MongoDB Atlat**
- **Docker** if you want to deploy on container

## Frontend

1. Move to frontend folder
```bash
cd frontend
```
2. Install dependencies
```
npm install
```
3.
- Copy `.env.`test to `.env`
- Edit these field
```bash
VITE_API_URL=http://localhost:3000
VITE_HOST=http://localhost:5173
```
4. Run.
```
npm run dev
```
## Backend
1. Move to backend folder
```bash
cd backend
```
2. Setup `.env` 
- Copy `.env.`test to `.env`
- Edit these field
```bash
SERVER_URL=http://localhost:3000
MONGO_DB_URL=your_mongodb_connection_string
GMAIL_MAIL=your_gmail_address
GMAIL_MAIL_TOKEN=your_gmail_app_password
JWT_ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
```
3. Install dependencies
```
npm install
```
4. Run
```
npm run dev
```

## Database
1. Use `mongodb` container
```bash
cd tools/mongodb
sudo docker-compose up -d
```
2. Or use `MongoDB Atlat` and connect by `MONGO_DB_URL` in `.env` file

# ✅ Production
## Frontend
```bash
npm run build
```
This will create `/dist` folder which can be served by `Nginx`  
Before use it, you need to change this folder permission.  
```
sudo chown root
sudo chmod -R 705 dist
```
To use `Nginx` in `Docker` to deploy this.
On main folder run:
```bash
sudo docker-compose up -d
```
**📌Note:** If you are using Cloudflare tunnel to host, sometime it needs to be cleaned cache to update to the latest version of website from Nginx.

## Backend
```bash
cd backend
sudo docker-compose up -d
```
- Use Nginx of frontend to proxy `/api` route to this Docker Container

## For MongoDB
1. Use `mongodb` container
```bash
cd tools/mongodb
sudo docker-compose up -d
```
2. Or use `MongoDB Atlat` and connect by `MONGO_DB_URL` in `.env` file

# 🤝 Contributing
I am welcome any contribution! =D  
If you have any questions, please issue me.