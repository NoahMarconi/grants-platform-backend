import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

const app = 'http://localhost:7001'
const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzY4MTM5MzZ9.Ij3nxCtLY33KMvPLyNNSSxpyzfKJyUa9xH1BLvOIDQM';


describe('add grantfund',()=>{
    it('should add grantfund', ()=>{
      return request(app)
      .post('/api/v1/grantFund')
      .send({
        "grant": "5e12fee6f7f4c125f46d009e",
        "donor": "5e07040a8a937d3cb0df9378",
        "fundingAmount": 100
    })
       .set('Accept', 'application/json')
       .set('Authorization', 'Bearer ' + token)
       .expect(200);
    })
  })

  describe('getAll ', () => {
    it(`/GET`, () => {
       return request(app)
         .get('/api/v1/grantFund')
         .set('Accept', 'application/json')
         .set('Authorization', 'Bearer ' + token)
         .expect(200)
     });
   
   });

   describe('get By id ', () => {
    it(`/GET`, () => {
       return request(app)
         .get('/api/v1/grantFund/5e1313453d281a1a78d15c65')
         .set('Accept', 'application/json')
         .set('Authorization', 'Bearer ' + token)
         .expect(200)
     });
   
   });

   describe('fundedByMe ', () => {
    it(`/GET`, () => {
       return request(app)
         .get('/api/v1/grantFund/fundedByMe/5e07040a8a937d3cb0df9378')
         .set('Accept', 'application/json')
         .set('Authorization', 'Bearer ' + token)
         .expect(200)
     });
   
   });

   describe('update grant',()=>{
    it('should update grant', ()=>{
      return request(app)
       .put('/api/v1/grantFund')
       .send({
        "_id": "5e1306a2f7f4c125f46d00ae",
        "grant": "5e0f00c30a69d603b45aee2b",
        "donor": "5e07040a8a937d3cb0df9378",
        "fundingAmount": 100
    })
       .set('Accept', 'application/json')
       .set('Authorization', 'Bearer ' + token)
       .expect(200);
    })
  })

  describe('delete grant',()=>{
    it('should delete grant', ()=>{
      return request(app)
       .delete('/api/v1/grantFund/5e1306a2f7f4c125f46d00ae')
       .set('Accept', 'application/json')
       .set('Authorization', 'Bearer ' + token)
       .expect(200);
    })
  })