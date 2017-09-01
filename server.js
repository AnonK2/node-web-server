const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

//__dirname__ ==> is "node-web-server" folder path (pwd)
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 3000); //if process.env.PORT doesn't exist, port set to "3000" instead.

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
      if (err) {
          console.log('Unable to append to server.log');
          return;
      }
    });
    next();
});

var maintenanceMiddleware = (req, res) => {
    res.render('maintenance', {
      title: "Maintenance",
      header: "We'll be right back",
      message: "The site is currently being updated."
    });
};

app.use(maintenanceMiddleware);
app.use(express.static(__dirname + '/public'));

//registerHelper
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (msg) => {
    if (typeof msg === 'string') {
        return msg.toUpperCase();
    }
});

//router
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        message: 'Welcome!!!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

//listen
app.listen(app.get('port'), () => {
    console.log(`Server started ${app.get('port')}`);
});
