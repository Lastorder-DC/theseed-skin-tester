var express = require('express');
var swig    = require('swig-templates');
var fs      = require('fs');
var app     = express();

function STUB(req, res) {
  res.send("STUB()");
}

app.get('/test/:skin', function (req, res) {
  res.redirect('/test/' + req.params.skin + '/document');
});

app.get('/w/:document', STUB);

app.get('/edit/:document', STUB);

app.get('/discuss/:document', STUB);

app.get('/RecentChanges', STUB);

app.get('/RecentDiscuss', STUB);

app.get('/test/:skin/document', function (req, res) {
  app.use('/skins/' + req.params.skin, express.static('./skins/' + req.params.skin + '/static'));

  var config = require('./skins/' + req.params.skin + '/config.json');
  var perms = {
    has: function(perm) {
      return true; //TODO implement perm check code(based on cookie)
    }
  }
  fs.readFile('./views/help.html', function(err, data) {
    skin = swig.renderFile('./skins/' + req.params.skin + '/views/default.html', {
      'url': './test/' + req.params.skin + '/document',
      'content': data,
      'perms': perms,
      'member': false, //TODO implement login/logout status by cookie
      'document': {
        'title': "스킨테스터"
      }
    });
    result = swig.renderFile('./views/layout.html', {
      'url': './test/' + req.params.skin + '/document',
      rendered_skin: skin,
      title: "스킨테스터 - 더시드 스킨 테스터"
    });

    res.send(result);
  });
});

app.listen(3000, function () {
  swig.setFilter("avatar_url",function(input) { return "//secure.gravatar.com/avatar/f9d15c0e641cf1e852aeb4a8b710e503?d=retro";});
  swig.setFilter("encode_userdoc",function(input) { return input;});
  swig.setFilter("encode_doc",function(input) { return input.title;});
  swig.setFilter("to_date",function(input) { return input;});
  swig.setFilter("localdate",function(input, format) { return input;});
  app.use(express.static('static'));
  console.log('Example app listening on port 3000!');
});
