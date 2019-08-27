import express from 'express';
import QuestionRouter from './question.route';

export function init(app: express.Application): void {
  const router: express.Router = express.Router();

  app.use('/v1/questions', QuestionRouter);

  app.use(router);
}
