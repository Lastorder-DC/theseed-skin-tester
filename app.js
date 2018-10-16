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
  var cssFiles = [];
  var jsFiles = [];
  var perms = {
    has: function(perm) {
      return true; //TODO implement perm check code(based on cookie)
    }
  }
  var configObj = {
    getString: function(string, def_val) {
      if(string == "wiki.site_name") {
        return "스킨테스터";
      } else if(string == "wiki.copyright_text") {
        return '<img alt="크리에이티브 커먼즈 라이선스" style="border-width: 0;" src="/images/ccl.png"><br>이 저작물은 <a rel="license" href="//creativecommons.org/licenses/by-nc-sa/2.0/kr/">CC BY-NC-SA 2.0 KR</a>에 따라 이용할 수 있습니다. (단, 라이선스가 명시된 일부 문서 및 삽화 제외)<br>기여하신 문서의 저작권은 각 기여자에게 있으며, 각 기여자는 기여하신 부분의 저작권을 갖습니다.';
      } else if(string == "wiki.footer_text") {
        return '나무위키는 백과사전이 아니며 검증되지 않았거나, 편향적이거나, 잘못된 서술이 있을 수 있습니다.<br>나무위키는 위키위키입니다. 여러분이 직접 문서를 고칠 수 있으며, 다른 사람의 의견을 원할 경우 직접 토론을 발제할 수 있습니다.<br>';
      } else if(string == "wiki.sitenotice") {
        return null;
      }
      return def_val;
    }
  }
  fs.readFile('./views/help.html', function(err, data) {
    if(err) {
      data = "<span style=\"color:red;font-weight: bold;\"><h1>ERROR: Cannot find help.html</h1></span><p>help.html 파일을 찾을 수 없습니다. <code>/views/help.html</code> 파일이 있는지 확인해 주십시오.";
    }

    skin = swig.renderFile('./skins/' + req.params.skin + '/views/default.html', {
      'url': './test/' + req.params.skin + '/document',
      'content': data,
      'perms': perms,
      'config': configObj,
      'member': false, //TODO implement login/logout status by cookie
      'document': {
        'title': "스킨테스터"
      }
    });

    for(key in config.auto_js_targets['*']){
      jsFiles.push('/skins/' + req.params.skin + '/' + config.auto_js_targets['*'][key].path);
    }

    for(key in config.auto_css_targets['*']){
      cssFiles.push('/skins/' + req.params.skin + '/' + config.auto_css_targets['*'][key]);
    }

    result = swig.renderFile('./views/layout.html', {
      'url': './test/' + req.params.skin + '/document',
      'jsFiles': jsFiles,
      'cssFiles': cssFiles,
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
