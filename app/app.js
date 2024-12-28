const express = require('express');
const app = express();
const routes = require("./router");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const {Sequelize, sequelize} = require('./database/models/index');
const port = process.env.PORT;

/*const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено.');
    
    await sequelize.sync();
    console.log('База данных синхронизирована.');

  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
  }
};

syncDb();*/

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/", routes);
app.set('port', `${port}`);
app.listen(`${port}`);