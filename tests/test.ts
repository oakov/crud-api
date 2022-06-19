process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { Serv } from '../src/index.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Users API', () => {
  before(() => {
    const TEST_DATA = [
      {
        id: '2d9a8928-a745-4a5c-878f-a7e3fce115fc',
        username: 'Fuuj',
        age: 33,
        hobbies: [],
      },
      {
        id: '56512149-3576-499d-9aae-d03049e3aa85',
        username: 'Gjhkjh',
        age: 22,
        hobbies: ['hjghjghjg'],
      },
    ];

    // fs.writeFileSync('data-test.json', JSON.stringify(TEST_DATA));
  });

  it('should get all users', (done) => {
    chai
      .request(Serv)
      .get('/api/users')
      .end((err, res) => {
        expect(err).to.be.null;
        // expect(res).to.have.status(200);
        // expect(res.body).to.haveOwnProperty('data');

        done();
      });
  });
});
