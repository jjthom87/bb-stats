var nodemailer = require('nodemailer')

exports.send = (html) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
      }
    });
    var mailOptions = {
        from: process.env.EMAIL_ADMIN,
        subject: "Beanie Baby Checklist Contact Form Inquiry",
        to: process.env.EMAIL_ADMIN,
        html: html
    };
    transporter.sendMail(mailOptions, function(mailError, mailInfo){
        if(mailError){
            reject(mailError);
        }
        resolve(true);
    });
  })
}
