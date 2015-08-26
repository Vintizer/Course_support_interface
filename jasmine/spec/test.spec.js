var app = require('../index');
var request = require('supertest');
var _ = require('lodash');
var users = [{"id":"1","name":"Illya Klymov","phone":"+380504020799","role":"Administrator"},
  {"id":"2","name":"Ivanov Ivan","phone":"+380670000002","role":"Student","strikes":1},
  {"id":"3","name":"Petrov Petr","phone":"+380670000001","role":"Support","location":"Kiev"}];
describe('Неправильный код ответа на GET на /refreshAdmins', function(){
  it('Проверить, что дает статус 200, если указать Content-Type application/json.', function (done){
    request(app)
      .get('/refreshAdmins')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        expect(res.status).toEqual(200);
        done(err);
      });
  });
  it('Проверить, что ответ сервера содержит Content-Type application/json.', function (done) {
    request(app)
      .get('/refreshAdmins')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        expect(res.headers['content-type']).toEqual('application/json');
        done(err);
      });
  });
}); // Done
describe('Неправильное начальное состояние сервера при получении списка пользователей', function(){
  it('Проверить, что список пользователей = массив объектов', function (done){
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.body).toEqual(users);
        done(err);
      }
    )
  });
  it('Проверить, что ответ сервера содержит Content-Type application/json.', function (done){
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        expect(res.headers['content-type']).toEqual('application/json');
        done(err);
      });
  })
});// Done
describe('Неправильная реакция на запрос без Content-Type', function(){
  it('Проверить что возвращается 401 при запросе GET', function (done){
    request(app)
      .get('/api/users')
      //.set('')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
  it('Проверить что возвращается 401 при запросе POST', function (done){
    request(app)
      .post('/api/users')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
  it('Проверить что возвращается 401 при запросе PUT', function (done){
    request(app)
      .put('/api/users')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
  it('Проверить что возвращается 401 при запросе DELETE', function (done){
    request(app)
      .del('/api/users')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
});// Done
describe('Неправильная реакция на запрос с неправильным Content-Type', function(){
  it('Проверить что возвращается 401 при запросе GET', function (done){
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
  it('Проверить что возвращается 401 при запросе POST', function (done){
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
  it('Проверить что возвращается 401 при запросе PUT', function (done){
    request(app)
      .put('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
  it('Проверить что возвращается 401 при запросе DELETE', function (done){
    request(app)
      .del('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res) {
        expect(res.status).toEqual(401);
        done();
      }
    )
  });
});// Done
describe('Некорректная обработка PUT-запроса', function(){
  it('Проверить,что при запросе с правильным id и role ответ 204 и содержит хедеры. Проверить,что он записался с правильными данными', function(done){
  var putUser = {"id":"3","name":"Petrovich Petr","phone":"+380670000001","role":"Support","location":"Kiev"};
    request(app)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(putUser)
      .end(function(err, res){
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.body[2]).toEqual(putUser);
        done(err);
      });
    request(app) // Возвращаем начальное состояние массива
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(users[2])
      .end(function(err, res){
        done();
      });
  });
  it('Проверить, что при запросе с правильным id без role ответ 204  содержит хедеры. Проверить, что он записался с правильными данными и role = Student', function(done){
    var putStudent = {"id":"3","name":"Petrovich Petr","phone":"+380670000001","role":"","location":"Kiev"};
    request(app)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(putStudent)
      .end(function(err, res){
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.body[2].id).toEqual(putStudent.id);
        expect(res.body[2].name).toEqual(putStudent.name);
        expect(res.body[2].phone).toEqual(putStudent.phone);
        expect(res.body[2].location).toEqual(putStudent.location);
        expect(res.body[2].role).toEqual('Student');
        done(err);
      });
    request(app) // Возвращаем начальное состояние массива
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(users[2])
      .end(function(err, res){
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
  });
});// Done
describe('Некорректная обработка PUT-запроса (администратора)', function(done){
  it('Проверить,что при запросе с правильным id и role ответ 204 и содержит хедеры. Проверить,что он записался с правильными данными', function(done){
    var putAdmin = {"id":"1","name":"Vintizer","phone":"+380504020799","role":"Administrator"};
    request(app)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(putAdmin)
      .end(function(err, res){
        expect(res.headers['content-type']).toEqual('application/json');
        expect(res.status).toEqual(204);
        done();
      });
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.body[0]).toEqual(putAdmin);
        done(err);
      });
    request(app) // Возвращаем начальное состояние массива
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(users[0])
      .end(function(err, res){
        done();
      });
  });
});// Done
describe('Некорректная обработка неверного PUT-запроса', function(){
  it(' Проверить, что при запросе с неправильным id ответ 404 и содержит хедеры. Проверить, что он не записался', function(done){
    var putAdmin = {"id":"7","name":"Vintizer","phone":"+380507201145","role":"Administrator"};
    request(app)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(putAdmin)
      .end(function(err, res){
        expect(res.headers['content-type']).toEqual('application/json');
        expect(res.status).toEqual(404);
        done();
      });
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.body).toEqual(users);
        done(err);
      }
    )
  });

});// Done
describe('Некорректная обработка запроса на удаление', function(){
  it('Проверить, что дает статус 204, если указать Content-Type application/json.', function(done){
    request(app)
      .del('/api/users/3')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.status).toEqual(204);
        done(err);
      });
    request(app) // Возвращаем начальное состояние массива
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(users[2])
      .end(function(err, res){
      })
  });
  it('Проверить, что ответ сервера содержит Content-Type application/json.', function(done){
    request(app)
      .del('/api/users/3')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.headers['content-type']).toEqual('application/json');
        done(err);
      });
    request(app) // Возвращаем начальное состояние массива
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(users[2])
      .end(function(err, res){
      });
  });
  it('Проверить, что после успешного запроса на удаление - пользователя нет на сервере.', function(done){
    var usersDeleted = _.clone(users);
    usersDeleted.splice(2,1);
    request(app)
      .del('/api/users/3')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
      });
    request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err,res){
        //console.log(res.body);
        expect(res.body).toEqual(usersDeleted);
        done(err);
      });
    request(app) // Возвращаем начальное состояние массива
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(users[2])
      .end(function(err, res){
      });
  });
});
describe('Некорректная обработка неверного запроса на удаление', function(){
  it('Проверить, что DELETE запрос на /blablabla возвращает 404.', function(done){
    request(app)
      .del('/blablabla')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Проверить, что DELETE запрос на /api/users/НЕСУЩЕСТВУЮЩИЙ_ID возвращает 404.', function(done){
    request(app)
      .del('/api/users/123')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(res.status).toEqual(404);
        done();
      });
  });
});//!!!!!!!!!!!!!!!!
describe('Некорректная обработка некорректной роли', function(){
  it('Проверить, что при POST запросе с неправильной ролью ответ 401 и содержит хедеры', function(done){
    var userPost = {"name":"","phone":"","role":"NewRole"};
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(userPost)
      .end(function(err, res) {
        expect(res.headers['content-type']).toEqual('application/json');
        expect(res.status).toEqual(401);
        done();
      }
    )
  })
});//Done
describe('Некорректная обработка запроса без роли', function(){
  it('Проверить, что при POST запросе без роли ответ идет 200 и содержит id', function(done){
    var userPost = {"name":"","phone":""};
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(userPost)
      .end(function(err, res) {
        expect(res.headers['content-type']).toEqual('application/json');
        expect(res.status).toEqual(200);
        expect(res.body.id).toBeDefined();
        done();
      }
    )
  })
});//Done
describe('Некорректная обработка запроса на создание администратора', function(){
  it('Проверить, что при запросе на создание администратора ответ 200 с хедерами и id', function(done){
    var userPost = {"name":"","phone":"", role: 'Administrator'};
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(userPost)
      .end(function(err, res) {
        expect(res.headers['content-type']).toEqual('application/json');
        expect(res.status).toEqual(200);
        expect(res.body.id).toBeDefined();
        done();
      }
    )
  })
});
describe('Некорректная обработка запроса на создание помощника', function(){
  it('Проверить, что при запросе на создание помощника ответ 200 с хедерами и id', function(done){
    var userPost = {"name":"","phone":"", role: 'Support'};
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(userPost)
      .end(function(err, res) {
        expect(res.headers['content-type']).toEqual('application/json');
        expect(res.status).toEqual(200);
        expect(res.body.id).toBeDefined();
        done();
      }
    )
  })
});