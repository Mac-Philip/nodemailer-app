const creds = require('./nodemon.json')

// console.log(creds)

const  express = require('express');
const  app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")

const path = require('path');
const router = express.Router()

dotenv.config();

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
    port: 587,
    secure: false,
  // service: 'Gmail',
  auth: {
    user: creds.auth.user,
    pass: creds.auth.pass 
  },
});

app.post('/mail', (req, res, next) => {
    let email = req.body.email
    let message = req.body.message
    let subject = req.body.subject
    let name = req.body.name
    let company = req.body.company

    const mailOptions = {
        from :  name,
        to : email,
        subject: subject,
        html: `${name} from ${company} <noreply@${name}.com> <br /><br /> ${message}`
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            res.json({
                status:"err"
            }) 
            console.log(err)
            }
            else {
                res.json({
                    status: "success"
         })
         console.log("Email Sent" + data.response)
        }
    })
})

transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("The Server is ready to take our messages!😊");
    }
  });

// serve PORT running here
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.info(`server has started on ${PORT}`))