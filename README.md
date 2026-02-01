# Event Management Website

A professional, secure, and responsive event management website built with HTML, CSS, JavaScript, and Bootstrap.

## ⚠️ IMPORTANT: Run with Local Server

**Admin changes (content, gallery, etc.) will NOT work when opening HTML files directly** (file://) because:
- `localStorage` is origin-specific - admin.html and index.html need the same origin
- Opening files directly can use different origins per file

**Solution: Use a local server**

### Option 1: Double-click `start-server.bat`
- Run `start-server.bat` in the project folder
- Open http://localhost:3000/index.html (main site)
- Open http://localhost:3000/admin.html (admin panel)
- Login: `admin123`

### Option 2: VS Code Live Server
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"
- Admin: http://127.0.0.1:5500/admin.html (or your port)

### Option 3: Command line
```bash
npx serve -l 3000
```
Then open http://localhost:3000/index.html and http://localhost:3000/admin.html

## Features

### 🎨 Design & User Experience
- Modern, responsive design using Bootstrap 5.3.2
- Smooth scrolling and animations
- Mobile-friendly navigation with collapsible menu
- Interactive gallery with lightbox functionality
- Professional hero section with parallax effect
- Card-based service sections
- Client testimonials section
- Contact form with real-time validation

### 🔒 Security Features

#### Input Validation & Sanitization
- **XSS Protection**: All user inputs are sanitized to prevent cross-site scripting attacks
- **Email Validation**: Comprehensive email format validation with pattern checks
- **Phone Validation**: Indian phone number format validation
- **Name Validation**: Secure name validation (letters, spaces, and common characters only)
- **Message Validation**: Content length and pattern validation
- **Date Validation**: Future date validation for event dates

#### Content Security Policy (CSP)
- Strict CSP headers implemented via meta tags
- Prevents unauthorized script execution
- Controls resource loading (scripts, styles, fonts, images)

#### Rate Limiting
- Client-side rate limiting to prevent form spam
- Configurable request limits and time windows

#### CSRF Protection
- CSRF token generation utility (for server-side implementation)

#### Additional Security Measures
- Input sanitization functions
- Dangerous pattern detection
- Form validation on both client and server-side ready
- Secure form submission handling

## File Structure

```
event copy/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Custom CSS styles
├── js/
│   ├── script.js      # Main JavaScript for interactivity
│   └── security.js    # Security utilities and validation
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styling and animations
- **JavaScript (ES6+)**: Modern JavaScript for interactivity
- **Bootstrap 5.3.2**: Responsive framework
- **Bootstrap Icons**: Icon library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

1. Open `index.html` in a web browser
2. No build process required - pure HTML/CSS/JS
3. For production, consider:
   - Hosting on a secure HTTPS server
   - Implementing server-side form handling
   - Adding proper backend API endpoints
   - Setting up server-side CSP headers

## Security Best Practices Implemented

1. ✅ Input sanitization
2. ✅ XSS prevention
3. ✅ Email/Phone validation
4. ✅ Content Security Policy
5. ✅ Rate limiting (client-side)
6. ✅ Form validation
7. ✅ Secure form submission patterns

## Notes

- The contact form currently shows a success message (simulated submission)
- For production use, integrate with a backend API
- Add server-side validation in addition to client-side validation
- Implement proper CSRF tokens on the server side
- Set up proper CSP headers via server configuration (not just meta tags)

## License

This project is provided as-is for demonstration purposes.
