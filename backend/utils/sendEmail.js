const nodemailer = require('nodemailer');

const sendOrderEmail = async (order, user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password if using Gmail with 2FA
      },
    });

    // Generate table rows for each item including total
    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${item.name}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${item.size}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">x${item.quantity}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">₹${item.price * item.quantity}</td>
        </tr>`
      )
      .join('');

    const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color:white; padding:20px; text-align:center; border-radius:5px 5px 0 0;">
          <h1>Order Confirmed! 🎉</h1>
        </div>

        <div style="padding:20px; background-color:#f9f9f9;">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Thank you for your order! We're getting your items ready for shipment.</p>

          <div style="background-color:white; padding:15px; border-radius:5px; margin:20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${orderDate.toLocaleDateString('en-IN')}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
          </div>

          <div style="background-color:white; padding:15px; border-radius:5px; margin:20px 0;">
            <h3>Items Ordered</h3>
            <table style="width:100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color:#f0f0f0;">
                  <th style="padding:8px; text-align:left;">Product</th>
                  <th style="padding:8px; text-align:left;">Size</th>
                  <th style="padding:8px; text-align:left;">Qty</th>
                  <th style="padding:8px; text-align:left;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <div style="background-color:#e8f5e9; padding:15px; border-radius:5px; margin:20px 0;">
            <h3 style="margin-top:0;">Order Summary</h3>
            <p style="margin:4px 0;"><strong>Subtotal:</strong> ₹${order.subtotal || order.totalPrice}</p>
            <p style="margin:4px 0;"><strong>Tax:</strong> ₹${order.tax || 0}</p>
            <p style="margin:4px 0;"><strong>Shipping:</strong> ₹${order.shipping || 0}</p>
            <p style="margin:8px 0; font-size:18px; color:#2e7d32;">
              <strong>Total: ₹${order.totalPrice}</strong>
            </p>
          </div>

          <p>Your order will be processed and shipped soon. You'll receive a tracking number via email.</p>

          <div style="margin-top:30px; padding-top:20px; border-top:1px solid #ddd; text-align:center; color:#666; font-size:12px;">
            <p>Thank you for shopping with us!</p>
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order email:', error.message);
    // Don't throw to avoid blocking order creation
  }
};

module.exports = { sendOrderEmail };
