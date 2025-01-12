const express = require('express');
const app = express();
const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);



