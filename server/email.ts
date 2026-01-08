import nodemailer from "nodemailer";

// Configurar transporter do Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderId: number;
  orderDate: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          R$ ${Number(item.price).toFixed(2)}
        </td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              border-bottom: 3px solid #6366f1;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #6366f1;
              font-size: 24px;
            }
            .order-info {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .order-info p {
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #f0f0f0;
              padding: 10px;
              text-align: left;
              font-weight: bold;
              border-bottom: 2px solid #ddd;
            }
            .totals {
              text-align: right;
              margin-bottom: 20px;
            }
            .totals p {
              margin: 8px 0;
              font-size: 14px;
            }
            .totals .total {
              font-size: 18px;
              font-weight: bold;
              color: #6366f1;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #ddd;
            }
            .address {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .button {
              display: inline-block;
              background-color: #6366f1;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Pedido Confirmado!</h1>
            </div>

            <p>Olá ${data.customerName},</p>
            <p>Obrigado por sua compra! Seu pedido foi recebido com sucesso.</p>

            <div class="order-info">
              <p><strong>Número do Pedido:</strong> #${data.orderId}</p>
              <p><strong>Data:</strong> ${data.orderDate.toLocaleDateString("pt-BR")}</p>
              <p><strong>Status:</strong> Pendente de Pagamento</p>
            </div>

            <h3>Itens do Pedido</h3>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totals">
              <p>Subtotal: R$ ${Number(data.subtotal).toFixed(2)}</p>
              <p>Frete: ${Number(data.shipping) === 0 ? "Grátis" : `R$ ${Number(data.shipping).toFixed(2)}`}</p>
              <p>Impostos: R$ ${Number(data.tax).toFixed(2)}</p>
              <p class="total">Total: R$ ${Number(data.total).toFixed(2)}</p>
            </div>

            <h3>Endereço de Entrega</h3>
            <div class="address">
              <p>${data.address.street}, ${data.address.number}</p>
              ${data.address.complement ? `<p>${data.address.complement}</p>` : ""}
              <p>${data.address.city}, ${data.address.state} - ${data.address.zipCode}</p>
            </div>

            <p>Você pode acompanhar seu pedido em nossa plataforma. Qualquer dúvida, entre em contato conosco.</p>

            <div class="footer">
              <p>&copy; 2026 Tech Gadgets Store. Todos os direitos reservados.</p>
              <p>Este é um e-mail automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: data.customerEmail,
      subject: `Pedido Confirmado - Tech Gadgets Store #${data.orderId}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso:", info.messageId);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderId: number,
  newStatus: string
) {
  try {
    const statusMessages: Record<string, string> = {
      pagamento_confirmado: "Seu pagamento foi confirmado! Estamos preparando seu pedido.",
      processando: "Seu pedido está sendo processado e será enviado em breve.",
      enviado: "Seu pedido foi enviado! Você pode acompanhá-lo com o código de rastreamento.",
      entregue: "Seu pedido foi entregue! Obrigado pela compra.",
      cancelado: "Seu pedido foi cancelado.",
    };

    const message = statusMessages[newStatus] || "Seu pedido foi atualizado.";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              border-bottom: 3px solid #6366f1;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #6366f1;
              font-size: 24px;
            }
            .status-box {
              background-color: #f0f4ff;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
              border-left: 4px solid #6366f1;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Atualização do Pedido #${orderId}</h1>
            </div>

            <p>Olá ${customerName},</p>

            <div class="status-box">
              <p><strong>Novo Status:</strong> ${newStatus}</p>
              <p>${message}</p>
            </div>

            <p>Se você tiver dúvidas, entre em contato conosco.</p>

            <div class="footer">
              <p>&copy; 2026 Tech Gadgets Store. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: customerEmail,
      subject: `Atualização do Pedido #${orderId} - Tech Gadgets Store`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de atualização enviado com sucesso:", info.messageId);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de atualização:", error);
    return false;
  }
}
