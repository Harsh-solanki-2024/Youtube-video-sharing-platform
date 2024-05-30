const express = require('express')
const app = express()
const dotenv = require("dotenv");
dotenv.config();
const router = require('./routes/index');

const port = 3001 || process.env.PORT;

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})