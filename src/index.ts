import { createServer, IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import prepareAnswer from './prepare_answer.js';

dotenv.config();
const createMyServer = createServer(
  (req: IncomingMessage, res: ServerResponse): void => {
    prepareAnswer(req)
      .then((answer) => {
        res.writeHead(answer.status, {
          'Content-Length': Buffer.byteLength(answer.body),
          'Content-Type': 'application/json',
        });
        res.write(answer.body);
        res.end();
      })
      .catch((err) => {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.write(
          JSON.stringify({
            message:
              'An error occurred on the server while executing the request',
          })
        );
        res.end();
      });
  }
);

createMyServer.listen(process.env.PORT, () =>
  process.stdout.write(`Started at port ${process.env.PORT}\n`)
);
