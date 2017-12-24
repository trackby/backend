import { expect } from 'chai';
import * as mocha from 'mocha';
import * as request from 'supertest';
import * as server from '../bin/www';


describe('Create New Show Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const show = {
        image_url: 'url',
        info: 'Mr. Robot follows Elliot Alderson, a young computer programmer with an anxiety order, who is recruited by Mr Robot and his anarchist team of hackers fscoiety',
        writer_name: 'Sam Esmail',
        director_name: 'Niels Arden Oplev',
        trailer_url: 'https://www.youtube.com/watch?v=xIBiJ_SzJTA',
      };
      return request(server).post('/shows?show=Mr.Robot')
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
      .post('/shows?show=Mr.Robot')
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
        comment_body: 'Nice tv show! Everybody should follow'
      };
      describe('Successes', () => {
        return request(server)
        .post('/shows/comments?show=Mr.Robot')
        .type('form').send(comment).then((res: any) => {
          expect(res.statusCode).to.be.equal(200);
        });
      });
    });
  });

  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const comment = { id: 1 };
      describe('Errors', () => {
        return request(server)
        .post('/shows/comments?show=Mr.Robot')
        .type('form').send(comment).then((r: any) => {
          expect(r.statusCode).to.be.equal(400);
        });
      });
    });
  });
});

describe('Create Subcomment', () => {
  describe('Successes', () => {
    it('should return 200 Created', () => {
      const comment = {
        comment_body: 'I do not aggree with you. Mr. Robot sucks!',
        parent_id: 1
      };
      describe('Successes', () => {
        return request(server)
        .post('/comments/' + 1 + '/subcomments')
        .type('form').send(comment).then((res: any) => {
          expect(res.statusCode).to.be.equal(200);
        });
      });
    });
  });

  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const comment = {
        comment_body: 'I do not aggree with you. Mr. Robot sucks!',
      };
      describe('Errors', () => {
        return request(server)
        .post('/shows/' + 1 + '/comments')
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

describe('Mark Show As Watched', () => {
  it('should return 201 Created', () => {
    describe('Successes', () => {
      return request(server)
      .post('/shows/watch?show=Mr.Robot')
      .type('form').then((res: any) => {
        expect(res.statusCode).to.be.equal(201);
      });
    });
  });
});

/* Show */


/* Season */

describe('Create New  Season Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const season = {
        image_url: 'url',
        info: 'A notorious hacker takes an interest in cyber security engineer and vigilante styled computer hacker Elliot, while an evil corporation is hacked.',
        season_year: 2015,
        trailer_url: 'https://www.youtube.com/watch?v=xIBiJ_SzJTA',
      };
      return request(server).post('/shows?show=Mr.Robot&season=1')
      .type('form')
      .send(season).then((res: any) => {
        expect(res.statusCode).to.be.equal(201);
      });
    });
  });
  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const season = { info: 'this is trial!' };
      return request(server)
      .post('/shows?show=Mr.Robot&season=1')
      .type('form').send(season).then((res: any) => {
        expect(res.statusCode).to.be.equal(400);
      });
    });
  });
});


describe('Create New  Episode Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const episode = {
        image_url: 'url',
        info: 'Hello!',
        episode_name: 'HelloWorld',
        trailer_url: 'https://www.youtube.com/watch?v=xIBiJ_SzJTA',
      };
      return request(server).post('/shows?show=Mr.Robot&season=1&episode=1')
      .type('form')
      .send(episode).then((res: any) => {
        expect(res.statusCode).to.be.equal(201);
      });
    });
  });
  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const season = { info: 'this is trial!' };
      return request(server)
      .post('/shows?show=Mr.Robot&season=1&episode=1')
      .type('form').send(season).then((res: any) => {
        expect(res.statusCode).to.be.equal(400);
      });
    });
  });
});

describe('Create New  Season Comment Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const comment = {
        comment_body: 'This is season comment!'
      };
      return request(server).post('/shows/comments?show=Mr.Robot&season=1')
      .type('form')
      .send(comment).then((res: any) => {
        expect(res.statusCode).to.be.equal(200);
      });
    });
  });
  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const comment = { id: 2 };
      return request(server)
      .post('/shows/comments?show=Mr.Robot&season=1')
      .type('form').send(comment).then((res: any) => {
        expect(res.statusCode).to.be.equal(400);
      });
    });
  });
});

describe('Create New  Episode Comment Test', () => {
  describe('Successes', () => {
    it('should return 201 Created', () => {
      const comment = {
        comment_body: 'This is episode comment!'
      };
      return request(server).post('/shows/comments?show=Mr.Robot&season=1&episode=1')
      .type('form')
      .send(comment).then((res: any) => {
        expect(res.statusCode).to.be.equal(200);
      });
    });
  });
  describe('Errors', () => {
    it('should return 400 Bad Request', () => {
      const comment = { id: 2 };
      return request(server)
      .post('/shows/comments?show=Mr.Robot&season=1&episode=1')
      .type('form').send(comment).then((res: any) => {
        expect(res.statusCode).to.be.equal(400);
      });
    });
  });
});

