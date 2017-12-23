import { expect } from 'chai';
import * as mocha from 'mocha';
import * as request from 'supertest';
import * as server from '../bin/www';



describe('Register', () => {
  it('should return 200 OK', () => {
    return request(server).get('/shows').expect(200);
  });
});


describe('List Shows Test', () => {
  it('should return 200 OK', () => {
    return request(server).get('/shows').expect(200);
  });
});

describe('Create New Show Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const show = {
        image_url: 'url',
        info: 'Mr. Robot follows Elliot Alderson, a young computer programmer with an anxiety order, who is recruited by Mr Robot and his anarchist team of hackers fscoiety',
        show_name: 'Mr.Robot',
        writer_name: 'Sam Esmail',
        director_name: 'Niels Arden Oplev',
        trailer_url: 'https://www.youtube.com/watch?v=xIBiJ_SzJTA',
      };
      return request(server).post('/shows')
      .type('form')
      .send(show).then((res: any) => {
        expect(res.statusCode).to.be.equal(201);
      });
    });
  });
  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const show = { info: 'this is trial!' };
      return request(server)
      .post('/shows')
      .type('form').send(show).then((res: any) => {
        expect(res.statusCode).to.be.equal(400);
      });
    });
  });
});

describe('Create Show Comment Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const comment = {
        comment_body: 'Nice tv show! Everybody should follow',
        user_id: 1
      };
      describe('Successes', () => {
        return request(server)
        .post('/shows/' + 1 + '/comments')
        .type('form').send(comment).then((res: any) => {
          expect(res.statusCode).to.be.equal(201);
        });
      });
    });
  });

  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const comment = { id: 2 };
      describe('Errors', () => {
        return request(server)
        .post('/shows/' + 1+ '/comments')
        .type('form').send(comment).then((r: any) => {
          expect(r.statusCode).to.be.equal(400);
        });
      });
    });
  });
});


describe('List Show Comment Test', () => {
  it('should return 200 OK', () => {
    return request(server).get('/shows/' + 1 + '/comments').expect(200);
  });
});

describe('Create Subcomment', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const comment = {
        comment_body: 'I do not aggree with you. Mr. Robot sucks!',
        user_id: 1,
        parent_id: 1
      };
      describe('Successes', () => {
        return request(server)
        .post('/comments/' + 1 + '/subcomments')
        .type('form').send(comment).then((res: any) => {
          expect(res.statusCode).to.be.equal(201);
        });
      });
    });
  });

  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const comment = {
        comment_body: 'I do not aggree with you. Mr. Robot sucks!',
        user_id: 1,
      };
      describe('Errors', () => {
        return request(server)
        .post('/shows/' + 1+ '/comments')
        .type('form').send(comment).then((r: any) => {
          expect(r.statusCode).to.be.equal(400);
        });
      });
    });
  });
});

describe('List Subcomments', () => {
  it('should return 200 OK', () => {
    return request(server).get('/comments/' + 1 + '/subcomments').expect(200);
  });
});


describe('Mark As Watched', () => {
  it('should return 201 Created', () => {
    describe('Successes', () => {
      return request(server)
      .post('/show/' + 1 + '/watch')
      .type('form').then((res: any) => {
        expect(res.statusCode).to.be.equal(201);
      });
    });
  });
});