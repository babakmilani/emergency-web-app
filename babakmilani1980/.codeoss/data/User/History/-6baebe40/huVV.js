const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});