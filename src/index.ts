import { createServer, IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import prepareAnswer from './prepare_answer.js';
import cluster from 'cluster';
import { cpus } from 'os';

export const Serv = (): void => {
  if (cluster.isPrimary && process.argv[2] === '--multi') {
    console.log(`Primary ${process.pid} is running`);
    const cpu: number = cpus().length;

    for (let i = 0; i < cpu; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    dotenv.config();
    const createMyServer = createServer(
      (req: IncomingMessage, res: ServerResponse): void => {
        if (cluster.isWorker)
          console.log(`Worker ${cluster.worker.id} handle request`);
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

    if (cluster.isWorker) console.log(`Worker ${process.pid} started `);
  }
};

Serv();
