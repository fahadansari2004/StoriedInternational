# Email Setup Instructions

The contact form is configured to send emails to: **ansaryfahad950@gmail.com**

## Method 1: FormSubmit.co (Currently Active - No Setup Required)

The form is already configured with FormSubmit.co. Here's what you need to do:

### First Time Setup (One-Time Only):

1. **Submit a Test Form**
   - Open `index.html` in your browser
   - Fill out the contact form with test data
   - Click Submit

2. **Confirm Your Email**
   - Check the inbox of **ansaryfahad950@gmail.com**
   - You'll receive a confirmation email from FormSubmit.co
   - Click the confirmation link in that email
   - This is a ONE-TIME setup to verify you own the email

3. **Done!**
   - After confirming, all future form submissions will automatically send emails
   - No additional setup needed

### How It Works:
- Form submits to: `https://formsubmit.co/ansaryfahad950@gmail.com`
- FormSubmit.co sends the form data to your email
- User is redirected to `thank-you.html` after submission
- You receive a nicely formatted email with all form details

---

## Method 2: EmailJS (Alternative - Requires Setup)

If FormSubmit.co doesn't work, you can use EmailJS:

### Setup Steps:

1. **Create EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account
   - Free tier: 200 emails/month

2. **Add Email Service**
   - Go to Email Services
   - Click "Add New Service"
   - Choose Gmail
   - Connect your Gmail account (ansaryfahad950@gmail.com)
   - Note the Service ID (e.g., `service_abc123`)

3. **Create Email Template**
   - Go to Email Templates
   - Click "Create New Template"
   - Use this template:

```
Subject: New Contact Form Submission - Event Management

From: {{from_name}} ({{from_email}})
Phone: {{phone}}

Function Date: {{functionDate}}
Number of Guests: {{numberOfGuests}}
Function Type: {{functionType}}

Message:
{{message}}
```

   - Note the Template ID (e.g., `template_xyz789`)

4. **Get Public Key**
   - Go to Account > API Keys
   - Copy your Public Key (e.g., `user_abc123xyz`)

5. **Update the Code**
   - Open `js/script.js`
   - Find the `submitForm()` function
   - Replace it with the EmailJS code below

### EmailJS Code:

```javascript
function submitForm() {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

    // Initialize EmailJS (replace with your keys)
    emailjs.init('YOUR_PUBLIC_KEY'); // e.g., 'user_abc123xyz'

    // Prepare template parameters
    const templateParams = {
        from_name: document.getElementById('fullName').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phoneNumber').value,
        functionDate: document.getElementById('functionDate').value || 'Not specified',
        numberOfGuests: document.getElementById('numberOfGuests').value || 'Not specified',
        functionType: document.getElementById('functionType').value || 'Not specified',
        message: document.getElementById('message').value || 'No message'
    };

    // Send email
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            showAlert('Thank you! Your message has been received. We will contact you shortly.', 'success');
            contactForm.reset();
            contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
        })
        .catch(function(error) {
            showAlert('An error occurred. Please try again or contact us directly.', 'danger');
            console.error('EmailJS error:', error);
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        });
}
```

6. **Add EmailJS Script**
   - Open `index.html`
   - Add this before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

---

## Method 3: Direct mailto: Link (Fallback)

If both methods fail, the form can open the user's email client:

1. Open `js/script.js`
2. Replace `submitForm()` with:

```javascript
function submitForm() {
    const formData = new FormData(contactForm);
    
    let emailBody = `New Contact Form Submission\n\n`;
    emailBody += `Full Name: ${formData.get('fullName')}\n`;
    emailBody += `Email: ${formData.get('email')}\n`;
    emailBody += `Phone: ${formData.get('phoneNumber')}\n`;
    emailBody += `Function Date: ${formData.get('functionDate') || 'N/A'}\n`;
    emailBody += `Number of Guests: ${formData.get('numberOfGuests') || 'N/A'}\n`;
    emailBody += `Function Type: ${formData.get('functionType') || 'N/A'}\n`;
    emailBody += `\nMessage:\n${formData.get('message') || 'No message'}`;
    
    const subject = encodeURIComponent('New Contact Form Submission - Event Management');
    const body = encodeURIComponent(emailBody);
    
    window.location.href = `mailto:ansaryfahad950@gmail.com?subject=${subject}&body=${body}`;
    
    showAlert('Opening your email client...', 'info');
}
```

---

## Troubleshooting

### FormSubmit.co Not Working?
- Check spam folder for confirmation email
- Make sure you clicked the confirmation link
- Try submitting the form again
- Check browser console (F12) for errors

### EmailJS Not Working?
- Verify all IDs are correct (Service ID, Template ID, Public Key)
- Check EmailJS dashboard for error logs
- Make sure Gmail service is connected
- Check monthly email limit (200 for free tier)

### Still Having Issues?
- Check browser console (F12) for error messages
- Verify internet connection
- Try a different browser
- Contact FormSubmit.co or EmailJS support

---

## Current Configuration

**Email Address:** ansaryfahad950@gmail.com  
**Phone Number:** +91-759-192-0678  
**Method:** FormSubmit.co (native form submission)  
**Redirect:** thank-you.html

**Form Fields:**
- Full Name (required)
- Phone Number (required)
- Email Address (required)
- Function Date (optional)
- Number of Guests (optional)
- Function Type (optional)
- Message (optional)

All form data is validated and sanitized before submission for security.
