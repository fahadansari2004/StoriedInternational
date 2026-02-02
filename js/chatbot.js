/**
 * AI Chatbot for Event Management Website
 * Provides automated responses to common queries
 */

(function () {
    'use strict';

    // DOM Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');

    // Chatbot knowledge base
    const responses = {
        services: {
            keywords: ['service', 'services', 'what do you do', 'offer', 'provide'],
            response: `We offer comprehensive event management services including:
            
• Wedding Planning & Destination Weddings
• Corporate Events & Conferences
• Photography & Videography
• Music & Entertainment
• Catering Services
• Private Parties

Would you like to know more about any specific service?`
        },
        pricing: {
            keywords: ['price', 'pricing', 'cost', 'budget', 'how much', 'expensive', 'cheap'],
            response: `Our pricing varies based on:
            
• Type of event
• Number of guests
• Services required
• Venue selection
• Date and duration

Average pricing ranges from ₹3 lakhs to ₹15 lakhs. For a detailed quote tailored to your needs, please fill out our contact form or call us at 7356044637.`
        },
        booking: {
            keywords: ['book', 'booking', 'reserve', 'schedule', 'plan event', 'organize'],
            response: `Great! I'd love to help you book an event. Here's how to get started:

1. Fill out our contact form with your event details
2. Our team will contact you within 24 hours
3. We'll discuss your requirements and provide a quote
4. Once confirmed, we'll start planning your perfect event!

Would you like me to direct you to the contact form?`
        },
        contact: {
            keywords: ['contact', 'phone', 'email', 'reach', 'call', 'address'],
            response: `You can reach us through:

📞 Phone: 7356044637
📧 Email: Storiedeventplanners@gmail.com
📍 Address: 123 Event Street, City

Our team is available Monday to Saturday, 9 AM - 6 PM. Feel free to call or email us anytime!`
        },
        wedding: {
            keywords: ['wedding', 'marriage', 'bride', 'groom', 'ceremony'],
            response: `We specialize in creating unforgettable weddings! Our wedding services include:

• Complete wedding planning
• Destination weddings
• Venue selection & decoration
• Catering & menu planning
• Photography & videography
• Music & entertainment
• Guest management

We handle everything from traditional ceremonies to modern celebrations. Would you like to discuss your wedding plans?`
        },
        corporate: {
            keywords: ['corporate', 'business', 'conference', 'seminar', 'company event'],
            response: `Our corporate event services include:

• Conferences & Seminars
• Product Launches
• Team Building Events
• Corporate Parties
• Trade Shows & Exhibitions
• Virtual & Hybrid Events

We ensure professional execution with attention to detail. Let's make your corporate event a success!`
        },
        photography: {
            keywords: ['photo', 'photography', 'video', 'videography', 'camera', 'pictures'],
            response: `Our photography & videography services capture every precious moment:

• Professional photographers & videographers
• Candid & traditional photography
• Drone photography
• Pre-wedding shoots
• Event highlights & albums
• Same-day editing options

We use the latest equipment to ensure stunning results!`
        },
        availability: {
            keywords: ['available', 'availability', 'free', 'date', 'when'],
            response: `To check availability for your event date:

1. Fill out our contact form with your preferred date
2. Call us directly at 7356044637
3. Email us at Storiedeventplanners@gmail.com

We'll respond within 24 hours with our availability and next steps!`
        },
        greeting: {
            keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            response: `Hello! 👋 Welcome to Storied International. I'm here to help you plan the perfect event. 

What would you like to know about our services?`
        },
        thanks: {
            keywords: ['thank', 'thanks', 'appreciate'],
            response: `You're welcome! 😊 Is there anything else I can help you with today?`
        },
        help: {
            keywords: ['help', 'assist', 'support'],
            response: `I'm here to help! You can ask me about:

• Our services
• Pricing & packages
• Booking an event
• Contact information
• Wedding planning
• Corporate events
• Photography services

What would you like to know?`
        }
    };

    // Initialize chatbot
    function init() {
        if (!chatbotToggle || !chatbotWindow) return;

        // Toggle chatbot window
        chatbotToggle.addEventListener('click', toggleChatbot);
        chatbotClose.addEventListener('click', closeChatbot);

        // Handle form submission
        chatbotForm.addEventListener('submit', handleSubmit);

        // Handle quick reply buttons
        quickReplyButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const message = this.getAttribute('data-message');
                sendMessage(message);
            });
        });

        // Add notification badge
        showNotificationBadge();
    }

    // Toggle chatbot window
    function toggleChatbot() {
        const isVisible = chatbotWindow.style.display !== 'none';
        chatbotWindow.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            chatbotInput.focus();
            removeNotificationBadge();
        }
    }

    // Close chatbot
    function closeChatbot() {
        chatbotWindow.style.display = 'none';
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        const message = chatbotInput.value.trim();

        if (message) {
            sendMessage(message);
            chatbotInput.value = '';
        }
    }

    // Send message
    function sendMessage(message) {
        // Add user message
        addMessage(message, 'user');

        // Simulate typing indicator
        showTypingIndicator();

        // Get bot response after delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message mb-3`;

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="d-flex align-items-start justify-content-end">
                    <div class="bg-primary text-white p-3 rounded">
                        <p class="mb-0 small">${SecurityUtils.sanitizeInput(text)}</p>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="bg-primary text-white rounded-circle p-2 me-2" style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                        <i class="bi bi-robot"></i>
                    </div>
                    <div class="bg-light p-3 rounded">
                        <p class="mb-0 small" style="white-space: pre-line;">${SecurityUtils.sanitizeInput(text)}</p>
                    </div>
                </div>
            `;
        }

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message bot-message mb-3';
        typingDiv.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="bg-primary text-white rounded-circle p-2 me-2" style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="bg-light p-3 rounded">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Get bot response based on user message
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Check each response category
        for (const [key, data] of Object.entries(responses)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return data.response;
            }
        }

        // Default response if no match found
        return `I'm not sure I understand. I can help you with:

• Services & Pricing
• Booking Events
• Contact Information
• Wedding Planning
• Corporate Events

Please ask me about any of these topics, or you can:
📞 Call us: 7356044637
📧 Email: Storiedeventplanners@gmail.com`;
    }

    // Show notification badge
    function showNotificationBadge() {
        if (!chatbotToggle.querySelector('.badge')) {
            const badge = document.createElement('span');
            badge.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
            badge.style.fontSize = '10px';
            badge.textContent = '1';
            chatbotToggle.style.position = 'relative';
            chatbotToggle.appendChild(badge);
        }
    }

    // Remove notification badge
    function removeNotificationBadge() {
        const badge = chatbotToggle.querySelector('.badge');
        if (badge) {
            badge.remove();
        }
    }

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
