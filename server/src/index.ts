import express from 'express';
import { createConnection } from 'typeorm';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import DBManager from './entity/DBManager';
import router from './router';
import { notFound, errorHandler } from './middlewares';

const config = dotenv.config();

if (config.error) {
  throw config.error;
}

const app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/', router);
app.use(notFound);
app.use(errorHandler);

const main = async () => {
  await createConnection({
    type: 'postgres',
    url: 'postgres://postgres:postgres@localhost/indigenousCaribbean',
    entities: ['dist/entity/**/*.js'],
    synchronize: true,
  });

  // eslint-disable-next-line no-console
  console.log('Connection to DB has been established successfully.');

  // Store places in mongoDB with detailed informations;
  await DBManager.createPlaces();

  const port = process.env.PORT || 88888;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${port}`);
  });
};

main().catch((error: any) => {
  // eslint-disable-next-line no-console
  console.error(error);
});
