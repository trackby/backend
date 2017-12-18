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

describe('Post New Show Test', () => {
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
