import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const subjectEmail = (dataSend) => {
  if (dataSend.language === 'vi') {
    return 'Thông tin đặt lịch khám bệnh';
  }
  return 'Appointment information';
};

const getBodyHTMLEmail = (dataSend) => {
  if (dataSend.language === 'vi') {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #2c3e50; text-align: center;">Xin chào ${dataSend.patientName}!</h2>
        <p style="font-size: 16px; color: #333;">Bạn nhận được email này vì bạn đã <b style="color:#27ae60;">đặt lịch khám bệnh thành công!</b> 🎉</p>
        <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
            <p style="margin: 5px 0; font-size: 15px;"><b>⏰ Thời gian:</b> ${dataSend.time}</p>
            <p style="margin: 5px 0; font-size: 15px;"><b>👨‍⚕️ Bác sĩ:</b> ${dataSend.doctorName}</p>
        </div>
        <p style="font-size: 15px; color: #555;">Nếu các thông tin trên là chính xác, vui lòng nhấn nút bên dưới để xác nhận và hoàn tất quy trình đặt lịch.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${dataSend.redirectLink}" target="_blank" style="background: #3498db; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
            Xác nhận đặt lịch
            </a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi ❤️</p>
        </div>`;
  }
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #2c3e50; text-align: center;">Hello ${dataSend.patientName}!</h2>
        <p style="font-size: 16px; color: #333;">You received this email because you have <b style="color:#27ae60;">Appointment successful!</b> 🎉</p>
        <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
            <p style="margin: 5px 0; font-size: 15px;"><b>⏰ Time:</b> ${dataSend.time}</p>
            <p style="margin: 5px 0; font-size: 15px;"><b>👨‍⚕️ Doctor:</b> ${dataSend.doctorName}</p>
        </div>
        <p style="font-size: 15px; color: #555;">If the above information is correct, please click the button below to confirm and complete the booking process.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${dataSend.redirectLink}" target="_blank" style="background: #3498db; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
            Confirm appointment
            </a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">Thank you for trusting and using our services. ❤️</p>
        </div>`;
};

const getBodyHTMLEmailRemedy = (dataSend) => {
  if (dataSend.language === 'vi') {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #2c3e50; text-align: center;">Xin chào ${dataSend.patientName}!</h2>
        <p style="font-size: 16px; color: #333;">Bạn nhận được email này vì bạn đã <b style="color:#27ae60;">khám bệnh thành công!</b> 🎉</p>
        <p style="font-size: 15px; color: #555;">Thông tin đơn thuốc/hóa đơn được gửi đính kèm.</p>
        <p style="font-size: 14px; color: #777; text-align: center;">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi ❤️</p>
        </div>`;
  }
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #2c3e50; text-align: center;">Hello ${dataSend.patientName}!</h2>
        <p style="font-size: 16px; color: #333;">You received this email because you have <b style="color:#27ae60;">Appointment successful!</b> 🎉</p>
        <p style="font-size: 14px; color: #777; text-align: center;">Thank you for trusting and using our services. ❤️</p>
        </div>`;
};

export const sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"BOOKING-CARE" <tien83442@gmail.com>',
    to: dataSend.receiveEmail,
    subject: subjectEmail(dataSend),
    html: getBodyHTMLEmail(dataSend),
  });
};

export const sendAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"BOOKING-CARE" <tien83442@gmail.com>',
    to: dataSend.email,
    subject: subjectEmail(dataSend),
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split('base64,')[1],
        encoding: 'base64',
      },
    ],
  });
};

export default { sendSimpleEmail, sendAttachment };
