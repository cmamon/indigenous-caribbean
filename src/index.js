const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');

const config = dotenv.config();

if (config.error) {
  throw config.error;
}

const router = require('./router');
const middlewares = require('./middlewares');
const { connectToDB, createPlaces, eraseDB } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

connectToDB()
  .then(async () => {
    // Re-initialize database on every server start
    await eraseDB();

    // Store places in mongoDB with detailed informations;
    await createPlaces();

    const port = process.env.PORT || 88888;
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    throw new Error(err.message);
  });
