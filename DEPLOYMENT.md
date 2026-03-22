# Quick Deployment Guide

## Deploy Backend to Vercel

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong random secret
     - `FRONTEND_URL`: Your frontend URL
     - `NODE_ENV`: production

### Option 2: Using GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/import
   - Select your GitHub repo
   - Set Root Directory to `./backend`
   - Add environment variables
   - Deploy

## Deploy Frontend to Vercel

### Option 1: Using Vercel CLI

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add environment variable**
   - `REACT_APP_API_URL`: Your backend API URL

### Option 2: Using GitHub

1. **Connect to Vercel**
   - Go to https://vercel.com/import
   - Select your GitHub repo
   - Set Root Directory to `./frontend`
   - Add environment variable: `REACT_APP_API_URL=<your-backend-url>`
   - Deploy

## Alternative Deployment Options

### Backend
- **Heroku** (git push deployment)
- **Railway** (GitHub integration)
- **AWS EC2** (VPS)
- **DigitalOcean App Platform**

### Frontend
- **Vercel** (recommended for React)
- **Netlify** (drag-and-drop or GitHub)
- **GitHub Pages** (for static builds)
- **Surge.sh** (simple command-line deploy)

## Environment Setup for Production

### Backend .env (Production)
```
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_very_strong_random_secret_key_here
DOCTOR_EMAIL=doctor@example.com
DOCTOR_PASSWORD=your_secure_password
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend .env (Production)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

## Verifying Deployment

1. **Test API endpoints**
   ```bash
   curl https://your-backend-url/api/health
   ```

2. **Test login**
   - Navigate to your frontend URL
   - Click Doctor Login
   - Try demo credentials

3. **Test booking**
   - Book appointment on home page
   - Check if it appears in doctor dashboard

## Troubleshooting Deployment

### CORS Errors
- Update `FRONTEND_URL` in backend environment variables
- Redeploy backend

### API Not Found
- Verify `REACT_APP_API_URL` is correct
- Check backend is deployed and running
- Redeploy frontend

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes Vercel IPs
- Test connection string in local env first

## Production Checklist

- [ ] Change all hardcoded credentials
- [ ] Generate strong JWT secret (use: `openssl rand -base64 32`)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Setup MongoDB backups
- [ ] Monitor logs on Vercel dashboard
- [ ] Test all functionality on production
- [ ] Setup error tracking (optional: Sentry)
- [ ] Monitor performance (optional: Vercel Analytics)

---

**Your deployed system is now live! Share the URLs with your interviewers.**
