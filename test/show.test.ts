import { expect } from 'chai';
import { Request, Response } from 'express';
import * as mocha from 'mocha';
import * as request from 'supertest';
import * as server from '../bin/www';

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
				info: 'This is trial!',
				show_name: 'Mr.Robot',
				trailer_url: 'sadastrailer',
			};
			return request(server).post('/shows').type('form').send(show).then((res: any) => {
				expect(res.statusCode).to.be.equal(201);
			});
		});
	});
	describe('Errors', () => {
		it('should return 400 Bad Request', () => {
			const show = { info: 'this is trial!' };
			return request(server).post('/shows').type('form').send(show).then((res: any) => {
				expect(res.statusCode).to.be.equal(400);
			});
		});
	});
});


describe('Delete Show Test', () => {
	describe('Successes', () => {
		it('should return 200 OK', () => {
			request(server).get('shows').then((r) => {
				return request(server).delete('/shows/' + r[0].id).then((res: any) => {
					expect(res.statusCode).to.be.equal(200);
				});
			});
		});
	});		
});

describe('Create Show Comment Test', () => {
	describe('Successes', () => {
		it('should return 201 Created', () => {
			const comment = {
				body: 'Nice tv show! Everybody should follow',
				user_id: 1
			};
			request(server).get('/shows').then((res) => {
				describe('Successes', () => {
					return request(server).post('/shows/' + res[0].id + '/comments').then((res: any) => {
						expect(res.statusCode).to.be.equal(200);
					});
				});
			});
		});
	});

	describe('Errors', () => {
		it('should return 400 Bad Request', () => {
			const comment = { id: 2 };
			request(server).get('/shows').then((res) => {
				describe('Errors', () => {
					return request(server).post('/shows/' + res[0].id + '/comments').type('form').send(comment).then((res: any) => {
						expect(res.statusCode).to.be.equal(400);
					});
				});
			});
		});
	});
});

describe('Delete Show Comment Test', () => {
	it('should return 200 ok', () => {
		request(server).get('/shows').then((res) => {
			describe('Successes', () => {
				return request(server).delete('/shows/' + res[0].id + '/comments').then((res: any) => {
					expect(res.statusCode).to.be.equal(200);
				});
			});
		});	
	});			
});
