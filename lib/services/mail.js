'use strict';

const Nodemailer = require('nodemailer');
const { Service } = require('schmervice');
const Mailgen = require('mailgen');
const Dotenv = require('dotenv');

Dotenv.config({ path: `${__dirname}\\..\\.env` });

module.exports = class MailService extends Service{
    async sendMails(user) {

        const transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Mailgen',
                link: 'https://mailgen.js/'
            }
        });

        const emailSubscription = {
            body: {
                name: user.firstname + ' ' + user.lastname,
                intro: `Information about your account`,
                table: {
                    data: [
                        {
                            item: 'login',
                            description: user.login
                        },
                        {
                            item: 'password',
                            description: user.password
                        }
                    ],
                    columns: {
                        // Optionally, customize the column widths
                        customWidth: {
                            item: '20%',
                            price: '15%'
                        },
                        // Optionally, change column text alignment
                        customAlignment: {
                            price: 'right'
                        }
                    }

                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
                // A voir
            }
        };
        const emailBody = mailGenerator.generate(emailSubscription);
        const emailText = mailGenerator.generatePlaintext(emailSubscription);
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Information for your user account',
            text: emailText,
            html: emailBody
        };


        await transporter.sendMail(mailOptions, (error, response) => {
            if (error){
                console.log('Erreur lors de l\'envoie du mail!');
                console.log(error);
            } else {
                console.log('Mail envoyé avec succès!');
                console.log(response);
            }

            transporter.close();
        });

    }
};
