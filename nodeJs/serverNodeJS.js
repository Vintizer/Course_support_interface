var http = require('http');
var requestGlobal;
var model= [{"id":"1","name":"Illya Klymov","phone":"+380504020799","role":"Administrator"}, // "Administrator" "Student" "Support"
  {"id":"2","name":"Ivanov Ivan","phone":"+380670000002","role":"Student","strikes":1},
  {"id":"3","name":"Petrov Petr","phone":"+380670000001","role":"Support","location":"Kiev"}];
var server =http.createServer();
var headersResponse = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Methods" : "GET,HEAD,PUT,POST,DELETE",
  "Content-Type": "application/json; charset=utf-8"
};
var handle = {
  'GET': handleGet,
  'POST': handlePost,
  'PUT': handlePut,
  'DELETE': handleDelete,
  'OPTIONS': handleOptions
};
function parsePost(req){
  var fullData='';
  req.on('data',function(data){
    if (data)fullData += data;
  });
  req.on('end', function(){
    req.emit('dataReady', JSON.parse(fullData))
  });
}
function response(res, id, text) {
  res.writeHead(+id, headersResponse);
  if (text) res.write(JSON.stringify(text));
  res.end();
}
function headersControl(req, res, rGl) {
  if (req.headers['content-type'] && req.headers['content-type'] === 'application/json') {
    return true;
  } else {
    response(res,401);
  }
}
function handleOptions(req, res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "GET,HEAD,PUT,POST,DELETE",
    "Access-Control-Allow-Headers" : "content-type"});
  res.end();
}
function handleGet(req, res) {
  if (!requestGlobal) {
    if (req.url === '/refreshAdmins') {
      response(res, 200);
    } else if (req.url === '/api/users'){
          if (headersControl(req, res)) {
            response(res, 200, model);
          }
    }
  } else {
    if (req.url === '/refreshAdmins') {
      response(res, 200);
    } else if (req.url === '/api/users'){
        response(res, 200, model);
  }
  //if (req.url === '/refreshAdmins') {
  //  response(res, 200);
  //} else if (req.url === '/api/users'){
  //  if (requestGlobal) {
  //    if (headersControl(req, res)) {
  //      response(res, 200, model);
  //    }
  //  } else {
  //    response(res, 200, model);
  //  }
  //
  }
}
function handlePost(req, res) {
  requestGlobal = true;
  //if (headersControl(req, res) && req.url === '/api/users') {
    parsePost(req);
    function saveAdmin(data){
      data.id = model.length + 1;
      model.push(data);
      response(res, 200, data);
    }
    function saveSupport(data) {
      console.log('saveSup');
      data.id = model.length + 1;
      model.push(data);
      response(res, 200, data);
    }
    function saveStudent(data){
      console.log('saveStu');
      data.role = 'Student';
      data.id = model.length + 1;
      model.push(data);
      response(res, 200, data);
    }
    function saveUnrole(data){
      console.log('saveUnr');
      response(res, 401);
    }
    req.on('dataReady', function(data){
      switch (data.role) {
        case 'Admin' :
          saveAdmin(data);
          break;
        case 'Administrator':
          saveAdmin(data);
          break;
        case 'Support':
          saveSupport(data);
          break;
        //case '':
        //  saveStudent(data);
        //  break;
        case undefined:
          saveStudent(data);
          break;
        case 'Student':
          saveStudent(data);
          break;
        default:
          saveUnrole(data);
      }
    })
  //}
}
function handlePut(req, res) {
  requestGlobal = true;
  //if (headersControl(req,res)) {
    parsePost(req);
    req.on('dataReady', function(data){
      var i;
  if (data.role === 'Administrator') {
      if (+data.id !== +req.url.split('/')[req.url.split('/').length-1]) {
        response(res, 404);
      } else {
        model.forEach(function(user, index) {
          if (user.id ===  data.id) i = index;
        });
        //if (!i) response(res, 404);
        if (data.role === model[i].role) {
          if (data.role === 'Support' && data.location || data.role === 'Student' && data.strikes || data.role === 'Administrator') {
            model[i] = data;
            response(res,204);
          } else response(res, 404);
        } else {
          response(res, 404);
        }
      }
    } else {
      model.forEach(function(user, index) {
        if (user.id ===  data.id) i = index;
      });
    if (!data.role) data.role='Student';
    model[i] = data;
    response(res,204);
  }
    });
}
function handleDelete(req, res) {
  requestGlobal = true;
  //if (headersControl(req, res)) {
    if (req.url.indexOf('/api/users') === 0 ) {
      var deleted;
      var arr = req.url.split('/');
      var i;
      arr.forEach(function(a, index){
        if(a === 'users') i = index;
      });
      var reqId = req.url.split('/')[i+1];
      model.forEach(function(user, index){
        if (+user.id === +reqId) {
          model.splice(index, 1);
          deleted = true;
        }
      });
      if (deleted) {
        response(res, 204);
      } else {
        response(res, 404, "Not Found");
      }
    }
  //}
}

function serverRequest(req, res) {
  if (handle[req.method]) {
    handle[req.method](req, res);
  } else     {
    response(res, 500);
  }
}
server.on('request',function(req,res) {
  serverRequest(req, res)
});
if (module.parent) {module.exports = server} else { server.listen(20007); }