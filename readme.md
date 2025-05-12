# Tokar Backend

**Description**  
Tokar Game App ka backend server, jiski madad se users authenticate honge, apne stats dekh sakenge, aur game modes mein participate kar sakenge. Yeh repository **Express.js**, **Prisma**, **MySQL**, aur **Zod** use karke structured, modular, aur scalable backend solution provide karti hai.

**Tech Stack**  
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **ORM:** Prisma  
- **Database:** MySQL  
- **Validation:** Zod  
- **Authentication:** JSON Web Tokens (JWT) + bcrypt  
- **Real-time:** Socket.IO  

**Project Structure**
```
tokar-backend/
├── prisma/                # Prisma schema & migrations
├── src/
│   ├── db/                # Prisma client init
│   ├── middlewares/       # AuthN/AuthZ, error-handler
│   ├── modules/           # Feature-based modules
│   │   ├── auth/          # Auth routes, controllers, services, validators
│   │   ├── stats/         # Stats routes, controllers, services
│   │   └── game/          # Game modes & real-time logic
│   ├── sockets/           # Socket.IO handlers (future)
│   ├── utils/             # Helpers (catchAsync, token utils)
│   └── app.js             # Express app setup
├── .env                   # Environment variables (ignored)
├── .gitignore             # Ignored files/folders
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+) installed  
- MySQL server up and running  
- `npm` or `yarn` package manager  

### Installation
1. Repository clone karo:
```bash
    git clone https://github.com/your-username/tokar-backend.git
    cd tokar-backend
```
2. Dependencies install karo:
```bash
    npm install
    # or
    yarn install
```# Tokar_Backend
# Tokar_Backend
# Tokar_Backend
# tokar_Backend
