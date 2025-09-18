# Deployment Guide for Faculty Pedia Frontend

## 🚀 Deployment Setup Instructions

### Environment Variables

Set these environment variables in your deployment platform:

#### Required Variables:

```bash
# Production API URL (replace with your actual backend URL)
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Alternative base URL (for backwards compatibility)
NEXT_PUBLIC_BASE_URL=https://your-backend-api.com

# Environment
NODE_ENV=production
```

### Platform-Specific Instructions

#### Vercel Deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
   - Add `NODE_ENV=production`

#### Netlify Deployment:

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard:
   - Go to Site Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
   - Add `NODE_ENV=production`

#### Other Platforms:

Ensure the following environment variables are set:

- `NEXT_PUBLIC_API_URL`: Your production backend URL
- `NODE_ENV=production`

### Backend Requirements

Your backend must:

1. Support CORS for your frontend domain
2. Accept requests from your frontend URL
3. Return proper HTTP status codes (401 for unauthorized, etc.)
4. Have the following endpoints:
   - `POST /api/auth/login-student`
   - `POST /api/auth/signup-student`
   - `POST /api/auth/signup-educator`

### Troubleshooting

#### Common Issues:

1. **CORS Errors**:

   - Ensure your backend allows requests from your frontend domain
   - Check if credentials are properly configured

2. **API Not Found (404)**:

   - Verify `NEXT_PUBLIC_API_URL` is correctly set
   - Check that your backend is deployed and accessible

3. **Login Loops**:

   - Clear browser storage: localStorage and cookies
   - Check browser console for redirect errors

4. **Network Errors**:
   - Verify backend is running and accessible
   - Check if API endpoints are correct

#### Debug Mode:

- The app includes a debug component showing environment info
- Click "Debug Info" button in bottom-right corner
- Check console logs for detailed error information

### Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server (if needed)
npm start
```

### Pre-deployment Checklist:

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] CORS is configured on backend
- [ ] All API endpoints are working
- [ ] Test login functionality with real backend
- [ ] Clear browser cache and test again

### Post-deployment Verification:

1. Open browser developer tools
2. Navigate to login page
3. Check console for any errors
4. Try logging in with valid credentials
5. Verify successful redirect after login
6. Check network tab for API calls

---

## Environment Variables Reference

| Variable               | Description             | Example                   |
| ---------------------- | ----------------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL`  | Production backend URL  | `https://api.yourapp.com` |
| `NEXT_PUBLIC_BASE_URL` | Alternative backend URL | `https://api.yourapp.com` |
| `NODE_ENV`             | Environment mode        | `production`              |

## Support

If you encounter issues:

1. Check the debug information panel
2. Review browser console logs
3. Verify environment variables are set
4. Test backend endpoints directly
5. Check network connectivity
