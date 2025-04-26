# 📋 Project Overview

This project offers a fast and lightweight solution for storing and sharing temporary content, similar to **Pastebin**. It's ideal for quick text sharing with minimal setup.

---

# 🛠️ Technologies Used

- **Node.js** – Backend server
- **React.js** – Web frontend
- **MongoDB** – Primary data storage
- **Redis** *(optional)* – Caching layer for enhanced performance
- **Docker** – Containerized deployment
- **GitHub CI/CD** – Automated build and deployment pipelines

---

# 🧪 Getting Started with Development

## To run the frontend locally:

```bash
npm run dev
```

## For the backend  
Open new terminal:
```bash
cd backend
node server.js
```

## For the database
Use `mongodb` container
```bash
cd tools/mongodb
sudo docker-compose up -d
```

# ✅ Production
## To run the frontend  
On main folder run:
```bash
sudo docker-compose up -d
```

## For the backend:
```bash
npm run build
```
This will create `/dist` folder which can be served by `Nginx`  
To use `Nginx` in `Docker` run
```bash
cd backend
sudo docker-compose up -d
```

## For MongoDB
This will deploy a `mongodb` container
```bash
cd tools/mongodb
sudo docker-compose up -d
```

