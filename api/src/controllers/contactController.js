
import ContactMessage from '../models/ContactMessage.js';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Send contact message
// @route   POST /api/contact/send
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long'
      });
    }

    // Save message to database
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim()
    });

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Contact Message</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <p style="margin: 0; line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p style="margin: 0;">This message was sent through your church website contact form.</p>
            <p style="margin: 5px 0 0 0;">Please reply directly to: ${email}</p>
          </div>
        </div>
      </div>
    `;

    const emailText = `
New Contact Message

Contact Details:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent through your church website contact form.
Please reply directly to: ${email}
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'daniel@innovatechnolgies.com', // Replace with your verified domain
      to: [process.env.PASTOR_EMAIL],
      subject: `New Contact Message from ${name}`,
      html: emailHtml,
      text: emailText,
      replyTo: email
    });

    console.log('Email sent successfully:', emailResponse.id);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        sentAt: contactMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Contact message error:', error);

    // Check if it's a Resend API error
    if (error.name === 'ResendError' || error.message?.includes('Resend')) {
      console.error('Resend API Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email notification. Your message was saved but please try contacting us directly.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact us directly.'
    });
  }
};