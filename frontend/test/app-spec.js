const {
  app
} = require('../src/app');
const {
  asyncReadFile,
  asyncWriteFile
} = require('../src/dao')
const request = require('supertest');

describe("app", () => {
  describe("get request", () => {
    it("should get all accounts when request url pattern is '/accounts'", (done) => {
      app.locals.dataFilePath = "./test/fixture.json"
      request(app).get('/accounts').expect(200).expect([{
          "name": "Tom",
          "phoneNumber": 123456,
          "email": "1@1.com"
        },
        {
          "name": "Jerry",
          "phoneNumber": 123456,
          "email": "1@2.com"
        }
      ]).end((err, res) => {
        if (err) throw err;
        done()
      })
    })

    it("should get specific account when request url patten is '/accounts/:email'", (done) => {
      request(app).get('/accounts/1@2.com').expect(200).expect({
        "name": "Jerry",
        "phoneNumber": 123456,
        "email": "1@2.com"
      }).end((err, res) => {
        if (err) throw err;
        done()
      })
    })
  })

  describe("post request", () => {
    afterEach(async function () {
      await asyncWriteFile(JSON.stringify([{
          "name": "Tom",
          "phoneNumber": 123456,
          "email": "1@1.com"
        },
        {
          "name": "Jerry",
          "phoneNumber": 123456,
          "email": "1@2.com"
        }
      ]), "./test/fixture.json")
    })
    it("should create a account when the corresponding email does not exist in the datasource", (done) => {
      request(app).post('/accounts').send({
        "name": "Tom",
        "phoneNumber": 123456,
        "email": "1@3.com"
      }).expect(201).expect([{
          name: 'Tom',
          phoneNumber: 123456,
          email: '1@1.com'
        },
        {
          name: 'Jerry',
          phoneNumber: 123456,
          email: '1@2.com'
        },
        {
          name: 'Tom',
          phoneNumber: 123456,
          email: '1@3.com'
        }
      ]).end((err, res) => {
        if (err) throw err;
        done()
      })
    })

    it("should not create the account when its email has already existed in the datasource", (done) => {
      request(app).post('/accounts').send({
        "name": "Tom",
        "phoneNumber": 123456,
        "email": "1@1.com"
      }).expect(400).end((err, res) => {
        if (err) throw err;
        done()
      })
    })
  })
})
