import * as request from 'supertest';
import { expect } from 'chai';
import 'mocha';
const server = require('../bin/www');

describe('List Shows Test', () => {
    it('should return 200 OK', () => {
        return request(server).get('/shows')
            .expect(200);
    });
});

describe('Post New Show Test', () => {
    describe('Successes', function() {
        it('should return 201 Created', () => {
            let show = {info:"this is trial!", show_name: "Mr.Robot", image_url: "url", trailer_url: "sadastrailer"};
            return request(server)
                .post('/shows')
                .type('form')
                .send(show)
                .then(function(res) {
                    expect(res.statusCode).to.be.equal(201);  
                })
                
        });
    });
    describe('Errors', function() {
        it('should return 400 Bad Request', () => {
            const show = {info:"this is trial!"};
            return request(server)
                .post('/shows')
                .type('form')
                .send(show)
                .then(function(res) {
                    expect(res.statusCode).to.be.equal(400);  
                })
                
        });
    });
});

