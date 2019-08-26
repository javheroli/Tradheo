const request = require('supertest'); //==================== routes.js Test ====================

const app = require('../server.js');
require('dotenv').config();
const expect = require('chai').expect;
const Simulator = require('../models/simulatorModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');


//==================== routes.js Test ====================

/**
 * Testing user signup endpoint
 */

describe('POST /api/auth/signup', () => {
  let user = {
    username: 'pruebas',
    password: 'pruebas',
    email: 'pruebas@gmail.com',
    phoneNumber: '+34 666 66 66 66',
    birthDate: '1997-09-19',
    firstName: 'pruebas',
    lastName: 'pruebas',
    description: 'pruebas',
    country: 'Spain',
    city: 'pruebas',
  }
  it('respond with 200 succesful operation and send the user created in body', (done) => {
    request(app)
      .post('/api/auth/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  });
  let user2 = {
    username: 'javheroli',
    password: 'pruebas',
    email: 'otro@gmail.com',
    phoneNumber: '+34 666 66 66 67',
    birthDate: '1997-09-19',
    firstName: 'pruebas',
    lastName: 'pruebas',
    description: 'pruebas',
    country: 'Spain',
    city: 'pruebas',
  }
  it('respond with 409 unauthorized and inform that username already exists', (done) => {
    request(app)
      .post('/api/auth/signup')
      .send(user2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        expect(res)
          .to.have.nested.property('error')
        expect(res.error.text)
          .to.equal('An Error occured: Username already exists');
        done();
      });
  });
  let user3 = {
    username: 'otro',
    password: 'pruebas',
    email: 'pruebas@gmail.com',
    phoneNumber: '+34 666 66 66 67',
    birthDate: '1997-09-19',
    firstName: 'pruebas',
    lastName: 'pruebas',
    description: 'pruebas',
    country: 'Spain',
    city: 'pruebas',
  }
  it('respond with 409 unauthorized and inform that email already exists', (done) => {
    request(app)
      .post('/api/auth/signup')
      .send(user3)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409, done)
  });
  let user4 = {
    username: 'otro',
    password: 'pruebas',
    email: 'otro@gmail.com',
    phoneNumber: '+34 666 66 66 66',
    birthDate: '1997-09-19',
    firstName: 'pruebas',
    lastName: 'pruebas',
    description: 'pruebas',
    country: 'Spain',
    city: 'pruebas',
  }
  it('respond with 409 unauthorized and inform that the phoneNumber already exists', (done) => {
    request(app)
      .post('/api/auth/signup')
      .send(user4)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409, done)

  });
});


/**
 * Testing username signup validation endpoint
 */

describe('GET /api/auth/signup/validationUsername/:username', () => {
  it('respond with 200 succesful operation because username is not in use', (done) => {
    request(app)
      .get('/api/auth/signup/validationUsername/nombredeusuarionuevo')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(200, done)
  });

  it('respond with 409 conflict and inform that username is already in use', (done) => {
    request(app)
      .get('/api/auth/signup/validationUsername/pruebas')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409, done)
  });
});

/**
 * Testing email signup validation endpoint
 */

describe('GET /api/auth/signup/validationEmail/:email', () => {
  it('respond with 200 succesful operation because email is not in use', (done) => {
    request(app)
      .get('/api/auth/signup/validationEmail/emailparapruebasfuncionales@gmail.com')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(200, done)
  });

  it('respond with 409 conflict and inform that email is already in use', (done) => {
    request(app)
      .get('/api/auth/signup/validationEmail/pruebas@gmail.com')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409, done)
  });
});

/**
 * Testing phoneNumber signup validation endpoint
 */

describe('GET /api/auth/signup/validationPhoneNumber/:phoneNumber', () => {
  it('respond with 200 succesful operation because phoneNumber is not in use', (done) => {
    request(app)
      .get('/api/auth/signup/validationPhoneNumber/+34 600 00 00 00')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(200, done)
  });

  it('respond with 409 conflict and inform that phoneNumber is already in use', (done) => {
    request(app)
      .get('/api/auth/signup/validationPhoneNumber/+34 666 66 66 66')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409, done)
  });
});




/**
 * Testing user login endpoint
 */

describe('POST /api/auth/login', () => {
  let user = {
    username: 'pruebas',
    password: 'pruebas'
  }
  it('respond with 200 succesful operation and send a token and a message in body', (done) => {
    request(app)
      .post('/api/auth/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

      .end((err, res) => {
        if (err) return done(err);
        expect(res)
          .to.have.nested.property('body')
          .that.includes.all.keys(['token', 'message'])
        expect(res.body['message'])
          .to.equal('Logged in Successfully');
        done();
      });
  });
  let user2 = {
    username: 'NOEXISTS',
    password: 'NOEXISTS'
  }
  it('respond with 401 unauthorized and inform that user not found', (done) => {
    request(app)
      .post('/api/auth/login')
      .send(user2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res)
          .to.have.nested.property('error')
        expect(res.error.text)
          .to.equal('An Error occured: User not found');
        done();
      });
  });
  let user3 = {
    username: "pruebas",
    password: "wrongpassword"
  }
  it('respond with 401 unauthorized and inform that password wrong', (done) => {
    request(app)
      .post('/api/auth/login')
      .send(user3)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res)
          .to.have.nested.property('error')
        expect(res.error.text)
          .to.equal('An Error occured: Wrong Password');
        done();
      });
  });



  it('respond with 409 conflict and inform that user is marked as deleted', async () => {
    const markAsDeleted = await User.findOneAndUpdate({
      username: 'pruebas'
    }, {
      isDeleted: true
    }).exec();

    await request(app)
      .post('/api/auth/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(409)
  });


  it('respond with 403 forbidden and inform that user licence has expired', async () => {
    const markAsNotDeleted = await User.findOneAndUpdate({
      username: 'pruebas'
    }, {
      isDeleted: false,
      licenceDate: new Date(2018, 7, 14)
    }).exec();

    await request(app)
      .post('/api/auth/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(403)


  });
});

/**
 * Testing update licence endpoint
 */

describe('GET /api/updateLicence/:username/:plan', () => {
  it('respond with 200 succesful operation for updating licence with 19.99 plan', (done) => {
    request(app)
      .get('/api/updateLicence/pruebas/19.99')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 200 succesful operation for updating licence with 49.99 plan', (done) => {
    request(app)
      .get('/api/updateLicence/pruebas/49.99')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 200 succesful operation for updating licence with 149.99 plan', (done) => {
    request(app)
      .get('/api/updateLicence/pruebas/149.99')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 400 bad request because plan does not exists', (done) => {
    request(app)
      .get('/api/updateLicence/pruebas/200.99')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(400, done)

  });

  it('respond with 404 not found because user does not exists', (done) => {
    request(app)
      .get('/api/updateLicence/notEXISTS/19.99')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(404, done)

  });
});

/**
 * Testing getUserWithoutLogin endpoint
 */

describe('GET /api/getUserWithoutLogging/:username', () => {
  it('respond with 200 succesful operation because user exists', (done) => {
    request(app)
      .get('/api/getUserWithoutLogging/javheroli')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 404 not found because user does not exist', (done) => {
    request(app)
      .get('/api/getUserWithoutLogging/NOTEXISTS')
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(404, done)

  });
});

//==================== SecureRoutes.js Test ====================

/**
 * Testing getUserLogged endpoint
 */

describe('GET /api/getUserLogged', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation because the token is correct', (done) => {
    request(app)
      .get('/api/getUserLogged')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/getUserLogged')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });

});

/**
 * Testing market/live/:country endpoint
 */

describe('GET /api/market/live/:country', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get last spain market data', (done) => {
    request(app)
      .get('/api/market/live/Spain')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 200 succesful operation and get last germany market data', (done) => {
    request(app)
      .get('/api/market/live/Germany')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/market/live/Spain')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });

});

/**
 * Testing /chart/getData/:company/:interval endpoint
 */

describe('GET /api/chart/getData/:company/:interval', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get chart data', (done) => {
    request(app)
      .get('/api/chart/getData/Acciona/1D')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 404 not found because company does not exists', (done) => {
    request(app)
      .get('/api/chart/getData/Notexists/1D')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /text/)
      .expect(404, done)
  });

  it('respond with 400 bad request because interval does not exists', (done) => {
    request(app)
      .get('/api/chart/getData/Acciona/asjkdf')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /text/)
      .expect(400, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/chart/getData/Acciona/1D')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /getUser/:username endpoint
 */

describe('GET /api/getUser/:username', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and user requested', (done) => {
    request(app)
      .get('/api/getUser/pruebas')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 404 not found because user does not exists', (done) => {
    request(app)
      .get('/api/getUser/notexists')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /text/)
      .expect(404, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/getUser/pruebas')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /editUser endpoint
 */

describe('POST /api/editUser', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and edit user', (done) => {
    request(app)
      .post('/api/editUser')
      .send({
        username: 'pruebas',
        email: 'pruebas@gmail.com',
        phoneNumber: '+34 666 66 66 66',
        birthDate: '1997-09-19',
        firstName: 'UPDATED',
        lastName: 'UPDATED',
        description: 'pruebas',
        country: 'Spain',
        city: 'pruebas',
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/editUser')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /users endpoint
 */

describe('GET /api/users', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get all users but logged user and blockeds', (done) => {
    request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /users/search/:keyword? endpoint
 */

describe('GET /api/users/search/:keyword?', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get all users containing javier in username, firstName or lastName', (done) => {
    request(app)
      .get('/api/users/search/javier')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 200 succesful operation and get all users', (done) => {
    request(app)
      .get('/api/users/search/')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/users/search/javier')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /blockUser/:username endpoint
 */

describe('GET /api/blockUser/:username', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and block user successfuly', (done) => {
    request(app)
      .get('/api/blockUser/javheroli')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /text/)
      .expect(200, done)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/blockUser/javheroli')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /unBlockUser/:username endpoint
 */

describe('GET /api/unBlockUser/:username', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and unblock user successfuly', (done) => {
    request(app)
      .get('/api/unBlockUser/javheroli')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /text/)
      .expect(200, done)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/unBlockUser/javheroli')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /messages endpoint
 */

describe('POST /api/messages', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and send message', (done) => {
    request(app)
      .post('/api/messages')
      .send({
        message: 'Hola',
        sender: 'pruebas',
        receiver: 'javheroli'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  });

  it('respond with 500 error and logged user is not the sender of this message', (done) => {
    request(app)
      .post('/api/messages')
      .send({
        message: 'Hola',
        sender: 'javheroli',
        receiver: 'pruebas'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(500, done)
  });

  it('respond with 500 error because sender and reciver can not be the same user', (done) => {
    request(app)
      .post('/api/messages')
      .send({
        message: 'Hola',
        sender: 'pruebas',
        receiver: 'pruebas'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(500, done)
  });

  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .post('/api/messages')
      .send({
        message: 'Hola',
        sender: 'pruebas',
        receiver: 'javheroli'
      })
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});


/**
 * Testing /messages/:sender/:receiver endpoint
 */

describe('GET /api/messages/:sender/:receiver', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get all messages between users', (done) => {
    request(app)
      .get('/api/messages/pruebas/javheroli')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/messages/pruebas/javheroli')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});


/**
 * Testing /chatNotifications endpoint
 */

describe('GET /api/chatNotifications', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get chatnotifications object', (done) => {
    request(app)
      .get('/api/chatNotifications')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/chatNotifications')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });

  });
});

/**
 * Testing /simulator/purchaseByUser endpoint
 */

describe('POST /api/simulator/purchaseByUser', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and return de simulator object created', (done) => {
    request(app)
      .post('/api/simulator/purchaseByUser')
      .send({
        company: 'Acciona',
        number: 1,
        purchaseValue: 30.125
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  });

  it('respond with 404 company not found', (done) => {
    request(app)
      .post('/api/simulator/purchaseByUser')
      .send({
        company: 'Not found',
        number: 1,
        purchaseValue: 30.125
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(404, done)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .post('/api/simulator/purchaseByUser')
      .send({
        company: 'Acciona',
        number: 1,
        purchaseValue: 30.125
      })
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });
  });
});

/**
 * Testing /api/simulator/getAll endpoint
 */

describe('GET /api/simulator/getAll', () => {
  var token = null;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation and get all simulations', (done) => {
    request(app)
      .get('/api/simulator/getAll')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', (done) => {
    request(app)
      .get('/api/simulator/getAll')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        done();
      });

  });
});

/**
 * Testing /api/simulator/sell/:id/:currentValue endpoint
 */

describe('GET /api/simulator/sell/:id/:currentValue', () => {
  var token = null;
  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 200 succesful operation sell simulation', async () => {
    const simulator = await Simulator.findOne({
      username: 'pruebas'
    }).exec();
    await request(app)
      .get('/api/simulator/sell/' + simulator._id + '/30.500')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', async () => {
    const simulator = await Simulator.findOne({
      username: 'pruebas'
    }).exec();
    await request(app)
      .get('/api/simulator/sell/' + simulator._id + '/30.500')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
      });

  });
});

/**
 * Testing /api/simulator/delete/:_id endpoint
 */

describe('GET /api/simulator/delete/:_id', () => {
  var token = null;
  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        username: 'pruebas',
        password: 'pruebas'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('respond with 204 no content and delete simulation', async () => {
    const simulator = await Simulator.findOne({
      username: 'pruebas'
    }).exec();
    await request(app)
      .delete('/api/simulator/delete/' + simulator._id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
  });


  it('respond with 401 Unauthorized because there is no token for authentication introduced', async () => {
    await request(app)
      .delete('/api/simulator/delete/')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        expect(res.error.text)
          .to.equal('Unauthorized')
        //done();
      });
    const deleteUserpruebas = await User.findOneAndRemove({
      username: 'pruebas'
    }).exec();
    const deleteMessaespruebas = await Message.find({
      sender: 'pruebas'
    }).remove();


  });
});