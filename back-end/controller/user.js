const UserModel = require('../modals/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const sendEmail = async (to, name) => {
    const subject = "Welcome to ACAD MCA!";
    const text = `Hi ${name},\n\nThank you for signing up with ACAD MCA! We’re thrilled to have you on board.\n\nBest regards,\nThe ACAD MCA Team`;
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ACAD MCA</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px;
                }
                .header img {
                    max-width: 150px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #888;
                }
                .footer a {
                    color: #1a73e8;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD MCA Logo">
                </div>
                <div class="content">
                    <h1>Welcome to ACAD MCA, ${name}!</h1>
                    <p>Thank you for signing up with ACAD MCA! We’re thrilled to have you on board.</p>
                    <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                    <p>Best regards,<br>The ACAD MCA Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 ACAD MCA. All rights reserved.</p>
                    <p><a href="https://acad-mca.vercel.app">Visit our website</a></p>
                </div>
            </div>
        </body>
        </html>
    `;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `"ACAD MCA Team" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });

    if (!info.messageId) {
        throw new Error('Failed to send email');
    }
};
const signup = (req, res) => {
    UserModel.findOne({ email: req.body.email })
        .then(async (existingUser) => {
            if (existingUser) {
                return res.status(409).send({ code: 409, message: "Email already exists" });
            }

            const NewUser = new UserModel({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            try {
                await NewUser.save();
                await sendEmail(req.body.email, req.body.name);
                res.status(200).send({ code: 200, message: "Signup successful" });
            } catch (err) {
                res.status(500).send({ code: 500, message: "Signup error", error: err.message });
            }
        })
        .catch(err => {
            res.status(500).send({ code: 500, message: "Internal server error", error: err.message });
        });
};
const sendGoogleSignupEmail = async (email, name) => {
    const subject = "Welcome to ACAD MCA!";
    const text = `Hi ${name},\n\nThank you for signing up using Google! We are thrilled to have you on board.\n\nACAD MCA is your virtual classroom designed to provide all the resources you need during your MCA journey. Whether it's study materials or placement preparation, we are here to help you every step of the way!\n\nIf you have any questions or need assistance, feel free to reach out to us anytime. We're here to support you!\n\nBest regards,\nThe ACAD MCA Team`;
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ACAD MCA</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header img {
                    max-width: 120px;
                }
                .content {
                    color: #555555;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .footer {
                    margin-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    padding-top: 10px;
                    text-align: center;
                    color: #999999;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Logo Section -->
                <div class="header">
                    <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD MCA Logo">
                </div>
                
                <!-- Welcome Section -->
                <h2 style="color: #333333; font-size: 24px; text-align: center;">Welcome to ACAD MCA, ${name}!</h2>
                <div class="content">
                    <p>Thank you for signing up using Google! We are thrilled to have you on board.</p>
                    <p><strong>ACAD MCA</strong> is your virtual classroom designed to provide all the resources you need during your MCA journey. Whether it's study materials or placement preparation, we are here to help you every step of the way!</p>
                    <p>If you have any questions or need assistance, feel free to reach out to us anytime. We're here to support you!</p>
                </div>
                
                <!-- Signature -->
                <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">Best regards,<br><strong>The ACAD MCA Team</strong></p>
                
                <!-- Footer -->
                <div class="footer">
                    <p>You’re receiving this email because you signed up on ACAD MCA.<br>If this wasn’t you, please contact support immediately.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: `"ACAD MCA Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text,
            html
        };

        let info = await transporter.sendMail(mailOptions);

        if (!info.messageId) {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }
};
const gsignup = async (req, res) => {
    const { token } = req.body;
    

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub: googleId } = ticket.getPayload();

        let user = await UserModel.findOne({ email });

        if (!user) {
        
            user = new UserModel({ googleId, name, email, isGoogleUser: true });
            await user.save();
            await sendGoogleSignupEmail(email, name);
        } else if (!user.isGoogleUser) {
            return res.status(400).json({ message: 'This email is already registered without Google sign-up.' });
        }
        

        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).send({ name: user.name, token: jwtToken });
    } catch (err) {
        res.status(500).send({ message: 'Google authentication failed' });
    }
};
const sendSigninEmail = async (to, name) => {
    const subject = "Welcome back to ACAD MCA!";
    const text = `Hi ${name},\n\nWe’re glad to see you back on ACAD MCA! If this wasn't you, please let us know immediately.\n\nBest regards,\nThe ACAD MCA Team`;
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome back to ACAD MCA</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px;
                }
                .header img {
                    max-width: 150px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #888;
                }
                .footer a {
                    color: #1a73e8;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD MCA Logo">
                </div>
                <div class="content">
                    <h1>Welcome back to ACAD MCA, ${name}!</h1>
                    <p>We’re glad to see you back on ACAD MCA! If this wasn't you, please contact us immediately.</p>
                    <p>Best regards,<br>The ACAD MCA Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 ACAD MCA. All rights reserved.</p>
                    <p><a href="https://acad-mca.vercel.app">Visit our website</a></p>
                </div>
            </div>
        </body>
        </html>
    `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `"ACAD MCA Team" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });

    if (!info.messageId) {
        throw new Error('Failed to send email');
    }
};
const signin = (req, res) => {
    UserModel.findOne({ email: req.body.email })
        .then(async (user) => {
            if (!user) {
                return res.status(404).send({ code: 404, message: "User not found" });
            }

            if (user.password !== req.body.password) {
                return res.status(401).send({ code: 401, message: "Wrong Password" });
            }

            req.session.userId = user._id;
            req.session.userName = user.name;

            const token = jwt.sign(
                { id: user._id, email: user.email },  // Payload
                process.env.SECRET_KEY,               // Secret key
                { expiresIn: '1h' }                  // Token expiration time (1 hour)
            );

            try {
                await sendSigninEmail(user.email, user.name);
                return res.status(200).send({
                    name: user.name,
                    code: 200,
                    message: "Signin successful",
                    token: token
                });
            } catch (err) {
                return res.status(500).send({ code: 500, message: "Signin email failed", error: err.message });
            }
        })
        .catch(err => {
            console.error('Signin error:', err);
            res.status(500).send({ code: 500, message: "Internal server error" });
        });
};
const sendGoogleSigninEmail = async (to, name) => {
    const subject = "Welcome back to ACAD MCA!";
    const text = `Hi ${name},\n\nWe’re glad to see you back on ACAD MCA! If this wasn't you, please let us know immediately.\n\nBest regards,\nThe ACAD MCA Team`;
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome back to ACAD MCA</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px;
                }
                .header img {
                    max-width: 150px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #888;
                }
                .footer a {
                    color: #1a73e8;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD MCA Logo">
                </div>
                <div class="content">
                    <h1>Welcome back to ACAD MCA, ${name}!</h1>
                    <p>We’re glad to see you back on ACAD MCA! If this wasn't you, please contact us immediately.</p>
                    <p>Best regards,<br>The ACAD MCA Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 ACAD MCA. All rights reserved.</p>
                    <p><a href="https://acad-mca.vercel.app">Visit our website</a></p>
                </div>
            </div>
        </body>
        </html>
    `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `"ACAD MCA Team" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });

    if (!info.messageId) {
        throw new Error('Failed to send email');
    }
};
const gsignin = async (req, res) => {
    const { idToken } = req.body;  // Ensure consistency with front-end key
    
    
    if (!idToken) {
        return res.status(400).json({ message: 'Google token is required.' });
    }

    try {
        
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
        const { email, sub: googleId } = payload;    
        let user = await UserModel.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up first.' });
        }
    
        if (!user.isGoogleUser) {
            return res.status(403).json({ message: 'This email is registered without Google. Please use email/password to sign in.' });
        }
    
        if (user.googleId !== googleId) {
            return res.status(403).json({ message: 'Google account mismatch. Please use the correct Google account.' });
        }
    
        req.session.userId = user._id;
        req.session.userName = user.name;
    
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
    
        await sendGoogleSigninEmail(user.email, user.name);
        return res.status(200).json({ name: user.name, token: jwtToken });
    
    } catch (err) {
        console.error('Google authentication failed:', err);
        if (err.message.includes('audience')) {
            return res.status(403).json({ message: 'Invalid Google Client ID or audience mismatch.' });
        }
        return res.status(500).json({ message: 'Google authentication failed.' });
    }
};
const sendotp = async (req, res) => {
    const { email } = req.body;

    
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    

    try {
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            
            return res.status(404).send({ code: 404, message: 'User not found' });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: `"ACAD MCA Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your OTP Code</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px;
                            font-size: 12px;
                            color: #888;
                        }
                        .footer a {
                            color: #1a73e8;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD MCA Logo" style="max-width: 150px;">
                        </div>
                        <div class="content">
                            <h1>OTP Code</h1>
                            <p>Your OTP code is <strong>${otp}</strong></p>
                            <p>If you did not request this, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 ACAD MCA. All rights reserved.</p>
                            <p><a href="https://acad-mca.vercel.app">Visit our website</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        
        const info = await transporter.sendMail(mailOptions);
        if (info.messageId) {
            await UserModel.updateOne({ email }, { otp });
            return res.status(200).send({ code: 200, message: 'OTP sent successfully' });
        } else {
            return res.status(500).send({ code: 500, message: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).send({ code: 500, message: 'Internal server error' });
    }
};
const sendPasswordUpdatedEmail = async (email) => {
    const subject = "Your Password Has Been Updated";
    const text = `Hi,\n\nYour password has been successfully updated. If you didn't make this change, please contact support immediately.\n\nBest regards,\nThe ACAD MCA Team`;
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Updated</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px;
                }
                .header img {
                    max-width: 150px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #888;
                }
                .footer a {
                    color: #1a73e8;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD MCA Logo" style="max-width: 150px;">
                </div>
                <div class="content">
                    <h1>Password Updated Successfully</h1>
                    <p>Your password has been successfully updated. If you did not request this change, please contact our support team immediately.</p>
                    <p>Best regards,<br>The ACAD MCA Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 ACAD MCA. All rights reserved.</p>
                    <p><a href="https://acad-mca.vercel.app">Visit our website</a></p>
                </div>
            </div>
        </body>
        </html>
    `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: `"ACAD MCA Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text,
        html
    };

    let info = await transporter.sendMail(mailOptions);

    if (!info.messageId) {
        throw new Error('Failed to send email');
    }
};

const submitotp = async (req, res) => {
    console.log(req.body);

    try {
       
        const user = await UserModel.findOne({ otp: req.body.otp });

        if (!user) {
            return res.status(400).send({ code: 400, message: 'OTP is incorrect or expired' });
        }

        
        await UserModel.updateOne({ email: user.email }, { password: req.body.password });

        
        await sendPasswordUpdatedEmail(user.email);

        return res.status(200).send({ code: 200, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during OTP submission:', error);
        return res.status(500).send({ code: 500, message: 'Internal server error' });
    }
};
const logout=(req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Logout successful' });
    });
  };
 const isAuthenticated = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
   
    
    if (!token) return res.status(401).send({ message: 'No token provided' });
    console.log("no token");
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send({ message: 'Failed to authenticate token' });
      
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      next();
    });
  };
  

module.exports = {
    signup,
    gsignup,
    signin,
    gsignin,
    sendotp,
    submitotp,
    logout,
    isAuthenticated
};
