import { validate as uuidValidate } from 'uuid';
import { IAnswer } from './const.js';
import isValidUrl from './isvalidurl.js';
import users from './users.js';
import { IncomingMessage } from 'http';

export default async (req: IncomingMessage): Promise<IAnswer> => {
  if (!isValidUrl(req.url))
    return {
      status: 404,
      body: JSON.stringify({
        message: `Request to non-existent endpoint: ${req.url}`,
      }),
    };
  const userId: string = req.url.split('/')[3] || '';
  if (userId !== '' && !uuidValidate(userId))
    return {
      status: 400,
      body: JSON.stringify({ message: 'Invalid User Id' }),
    };

  if (userId !== '' && !users.isUser(userId))
    return {
      status: 404,
      body: JSON.stringify({
        message: `User (id=${userId}) doesn't exist`,
      }),
    };

  switch (req.method) {
    case 'GET':
      return { status: 200, body: users.getUser(userId) };
    case 'DELETE':
      if (userId !== '') {
        users.deleteUser(userId);
        return { status: 204, body: '' };
      }
      return {
        status: 400,
        body: JSON.stringify({ message: 'Invalid User Id' }),
      };
    case 'POST':
      const answ: string = users.addUser(await getData(req));
      if (answ !== '')
        return {
          status: 201,
          body: answ,
        };
      return {
        status: 400,
        body: JSON.stringify({
          message:
            'The fields or field type of the transmitted data do not match the User type',
        }),
      };
    case 'PUT':
      if (userId === '')
        return {
          status: 400,
          body: JSON.stringify({ message: 'Invalid User Id' }),
        };
      const answw: string = users.changeUser(await getData(req), userId);
      if (answw !== '')
        return {
          status: 200,
          body: answw,
        };
      return {
        status: 400,
        body: JSON.stringify({
          message:
            'The fields or field type of the transmitted data do not match the User type',
        }),
      };
    default:
      return {
        status: 501,
        body: JSON.stringify({
          message: 'Request method not supported by the server',
        }),
      };
  }
};

function getData(request: IncomingMessage): Promise<object> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject();
      }
    });
  });
}
