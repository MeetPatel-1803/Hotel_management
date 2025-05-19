require("dotenv").config();
const sgMail = require("@sendgrid/mail");

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send an email
const sendResetEmail = (email, resetLink) => {
  const msg = {
    to: email,
    from: "meet94718@gmail.com", // Use your verified SendGrid sender email
    subject: "Password Reset Request",
    text: `Click here to reset your password: ${resetLink}`,
    html: `<strong>Click here to reset your password:</strong> <a href="${resetLink}">${resetLink}</a>`,
  };

  sgMail
    .send(msg)
    .then(() => console.log("Password reset email sent"))
    .catch((error) => console.error(error));
};

module.exports = sendResetEmail;
