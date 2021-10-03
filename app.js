const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const port = process.env.PORT || 8080;


//static file
app.use(express.static('public'))
app.use('css', express.static(__dirname + 'public/css'))
app.use('js', express.static(__dirname + 'public/js'))
app.use('image', express.static(__dirname + 'public/image'))
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});


//login & register
app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><div align ='center'><a href='./login.html'>LOGIN</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./register.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./index.html'>RETURN HOME</a></div>`);
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>LOGIN AGAIN</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});


app.listen(port);
console.log('Server started at http://localhost:' + port);


// telegram chatbox
const Telegraf = require('telegraf');

const bot = new Telegraf('2002930870:AAHF_KPcoESLwloZlNXbIhumCP5g9TVFHKc');

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to Macrame Home.', {
    })
})

bot.hears('macrame', ctx => {
    console.log(ctx.from)
    let macrameMessage = `Here are pictures of macrames you would love`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, macrameMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: "earing",
                        callback_data: 'earing'
                    },
                    {
                        text: "keychain",
                        callback_data: 'keychain'
                    }
                ],

            ]
        }
    })
})

//return earing image

bot.action('earing', ctx => {
    bot.telegram.sendPhoto(ctx.chat.id, {
        source: "public/image/ear5.jpg"
    })

})

//return keychain image

bot.action('keychain', ctx => {
    bot.telegram.sendPhoto(ctx.chat.id, {
        source: "public/image/key4.png"
    })

})

//request user's phone number

bot.hears('phone', (ctx, next) => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Can we get your phone number?', requestPhoneKeyboard);

})

//request user's location

bot.hears("location", (ctx) => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Can we access your location?', requestLocationKeyboard);
})

//constructor for providing phone number to the bot

const requestPhoneKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My phone number",
                request_contact: true,
                one_time_keyboard: true
            }],
            ["Cancel"]
        ]
    }
};
//constructor for proving location to the bot

const requestLocationKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My location",
                request_location: true,
                one_time_keyboard: true
            }],
            ["Cancel"]
        ]
    }

}

bot.launch();