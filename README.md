# Skylife Research
## Live Deployment

Production version available at:  
[https://skyliferesearch.com](https://skyliferesearch.com)

Features:
- Optimized production build
- Automated CI/CD pipeline
- Global CDN distribution
- SSL encryption
- 24/7 monitoring

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm/yarn

### Installation
1. Clone repo:
```bash
git clone https://github.com/AIQuant-SLR/Skyliferesearch.git
```
```bash
cd Skyliferesearch
```
2. Install packages:
```bash
npm install
```
3. Create .env file:
```env
VITE_SERVICE_ID=your_service_id
VITE_TEMPLETE_ID=your_template_id
VITE_EMAIJS_API=your_emailjs_api
VITE_API_TOKEN=your_api_token
```
## Running the Application

### Local Development
Start the development server:
```bash
npm run dev
```

## Project Structure

The repository follows a standard Vite/React project structure with these key directories:
```markdown
Skyliferesearch/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── Footer/
│   │   ├── Card/
│   │   └── ...other components
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── About/
│   │   ├── Contact/
│   │   └── ...other pages
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

Key features:
- Modular component architecture
- Separation of concerns (components vs pages)
- Asset management through dedicated directories
- Scalable folder structure
- Configuration files at root level
