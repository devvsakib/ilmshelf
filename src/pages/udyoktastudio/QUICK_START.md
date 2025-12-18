# 🚀 Quick Start Guide - 5 Minutes to Launch

## Step-by-Step Setup

### 1️⃣ Create Project Folder

```bash
mkdir udyokta-studio
cd udyokta-studio
```

### 2️⃣ Initialize Project

```bash
npm init -y
```

### 3️⃣ Install Dependencies

```bash
npm install react react-dom react-router-dom framer-motion lucide-react
npm install -D vite @vitejs/plugin-react tailwindcss@latest postcss autoprefixer
```

### 4️⃣ Create File Structure

```bash
# Create directories
mkdir -p src/pages src/demo/fashion src/demo/cosmetics src/demo/gadgets public

# Create files
touch src/App.jsx
touch src/main.jsx
touch src/index.css
touch vite.config.js
touch tailwind.config.js
touch postcss.config.js
touch index.html
touch .gitignore
```

### 5️⃣ Copy Configuration Files

Copy the content from the artifacts I provided:

1. **package.json** - Dependencies & scripts
2. **vite.config.js** - Vite configuration
3. **tailwind.config.js** - Tailwind CSS setup
4. **postcss.config.js** - PostCSS configuration
5. **index.html** - HTML entry point
6. **src/index.css** - Global styles
7. **src/main.jsx** - React entry
8. **src/App.jsx** - Main router
9. **.gitignore** - Git ignore rules

### 6️⃣ Copy Component Files

Copy these into your project:

-   **src/pages/Homepage.jsx** - The agency homepage (first artifact)
-   **src/demo/fashion/FashionDemo.jsx** - Fashion store (second artifact)
-   **src/demo/cosmetics/CosmeticsDemo.jsx** - Cosmetics store (third artifact)
-   **src/demo/gadgets/GadgetsDemo.jsx** - Gadgets store (fourth artifact)

### 7️⃣ Run Development Server

```bash
npm run dev
```

Open browser to: `http://localhost:5173`

---

## ✅ Verification Checklist

-   [ ] Homepage loads at `/`
-   [ ] Fashion demo loads at `/demo/fashion`
-   [ ] Cosmetics demo loads at `/demo/cosmetics`
-   [ ] Gadgets demo loads at `/demo/gadgets`
-   [ ] Theme toggle works (dark/light)
-   [ ] Language toggle works (EN/বাং)
-   [ ] Add to cart works
-   [ ] WhatsApp button opens with correct message
-   [ ] Mobile responsive design works

---

## 🎯 First Customizations

### 1. Update Contact Info

Search and replace in all demo files:

```javascript
// Find this:
https://wa.me/8801792552300

// Replace with your number:
https://wa.me/YOUR_NUMBER

// Find this:
UdyoktaStudio@gmail.com

// Replace with your email:
your-email@example.com
```

### 2. Update Agency Name (Optional)

If you want a different name:

```javascript
// In Homepage.jsx, find:
const AGENCY_NAME = "UdyoktaStudio";

// Change to your name
```

### 3. Add Real Products

In each demo store, update the `PRODUCTS` array:

```javascript
const PRODUCTS = [
    {
        id: 1,
        name: "Your Product Name",
        nameBn: "আপনার পণ্যের নাম",
        // ... add your product details
    },
];
```

---

## 🐛 Common Issues & Fixes

### Issue: `npm install` fails

**Solution:**

```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

### Issue: Port 5173 already in use

**Solution:**

```bash
# Kill the process
npx kill-port 5173

# Or use different port in vite.config.js:
server: {
  port: 3000
}
```

### Issue: Tailwind styles not loading

**Solution:**

```bash
# Restart dev server
# Make sure index.css imports are correct:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: React Router not working

**Solution:**

```bash
# Make sure react-router-dom is installed:
npm install react-router-dom

# Check if BrowserRouter wraps the app in App.jsx
```

---

## 📦 Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

The build will be in the `dist/` folder - ready to deploy!

---

## 🌐 Quick Deploy Options

### Option 1: Vercel (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click "Deploy"
5. Done! ✅

### Option 2: Netlify

1. Run `npm run build`
2. Drag `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Done! ✅

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 🎨 Brand Customization

### Change Primary Colors

In `tailwind.config.js`:

```javascript
colors: {
  brand: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
  }
}
```

Then use in components:

```jsx
className = "bg-brand-primary text-white";
```

### Add Your Logo

1. Add logo file to `public/` folder
2. Update in components:

```jsx
<img src="/your-logo.png" alt="Logo" />
```

---

## 📱 Test on Mobile

### Using Local Network

```bash
# When running dev server, look for:
# Network: http://192.168.x.x:5173

# Open this URL on your phone (same WiFi network)
```

### Using ngrok (Public URL)

```bash
# Install ngrok
npm install -g ngrok

# Run your dev server
npm run dev

# In new terminal:
ngrok http 5173

# Use the ngrok URL to test from anywhere
```

---

## 🔥 Performance Tips

1. **Optimize Images**: Use WebP format, compress images
2. **Lazy Load**: Images below fold can be lazy loaded
3. **Code Split**: Already handled by Vite
4. **CDN**: Use image CDN for product photos
5. **Caching**: Set proper cache headers in production

---

## 🆘 Need Help?

**Contact:**

-   WhatsApp: +8801792552300
-   Email: UdyoktaStudio@gmail.com

**Common Resources:**

-   [React Docs](https://react.dev)
-   [Tailwind CSS Docs](https://tailwindcss.com/docs)
-   [Vite Guide](https://vitejs.dev/guide/)
-   [Framer Motion](https://www.framer.com/motion/)

---

## ✨ Next Steps

After basic setup:

1. ✅ Customize products with real inventory
2. ✅ Add your own product images
3. ✅ Test WhatsApp integration thoroughly
4. ✅ Set up Google Analytics
5. ✅ Configure domain name
6. ✅ Add SSL certificate (automatic with Vercel/Netlify)
7. ✅ Create social media pages
8. ✅ Start marketing to potential clients!

---

**You're now ready to launch! 🚀**

_From Page to Brand - UdyoktaStudio_
