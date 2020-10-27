var express = require('express');
var router = express.Router();
var data = require('../data/data.json');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首頁 | 王瀚' });
});

router.get('/list/:cate', function(req, res, next) {
  let rdata = [];
  let rtitle = "網頁&nbsp;&nbsp;開發";
  let rengtitle = "Web<br>Development";
  switch(req.param('cate')){
    case "webdev":
      rtitle = "網頁&nbsp;&nbsp;開發";
      rengtitle = "Web<br>Development";
      break;
    case "uidesign":
      rtitle = "介面&nbsp;&nbsp;設計";
      rengtitle = "UI<br>Design";
      break;
    case "graphic":
      rtitle = "平面&nbsp;&nbsp;設計";
      rengtitle = "Graphic<br>Design";
      break;
    case "typography":
      rtitle = "標準字&nbsp;&nbsp;設計";
      rengtitle = "Typography<br>Design";
      break;
  }
  if(req.param('cate')=="typography" || req.param('cate')=="graphic"){
    let apiUrl = (req.param('cate')=="graphic")?"https://www.behance.net/v2/collections/168218391/projects?api_key=ufHWdF2Z0GgGzy69kvhTfa7lPCo6HYEY":"https://www.behance.net/v2/collections/168219335/projects?api_key=ufHWdF2Z0GgGzy69kvhTfa7lPCo6HYEY"
    request(apiUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        for(let i = 0; i < JSON.parse(response.body).projects.length; i++){
          rdata.push({
            "index": i,
            "og": {
              "Title": JSON.parse(response.body).projects[i].name,
              "Cover": JSON.parse(response.body).projects[i].covers.max_808,
              "Description": JSON.parse(response.body).projects[i].name,
              "Url": JSON.parse(response.body).projects[i].url
            }
          });
        }
        res.render('cateList', { title: rtitle.replace('&nbsp;&nbsp;','')+'作品列表 | 王瀚', cate: req.param('cate'), cateTitle: rtitle, cateEngTitle: rengtitle, data: rdata });
      }
    });
  }else{
    for(let i = 0; i < data.collect.length; i++){
      if(data.collect[i].Category.indexOf(req.param('cate'))!=-1){
        rdata.push({
          "index": i,
          "og": data.collect[i]
        })
      }
    }
    res.render('cateList', { title: rtitle.replace('&nbsp;&nbsp;','')+'作品列表 | 王瀚', cate: req.param('cate'), cateTitle: rtitle, cateEngTitle: rengtitle, data: rdata });
  }
});

router.get('/detail/:id', function(req, res, next) {
    let td = data.collect[req.param('id')];
    res.render('detail', { title: td.Title+' | 王瀚', data: td, content: parser(td.Content) });
});

function parser(input){
    var result = "";
    for(let i = 0; i < input.length; i++){
        switch(input[i].mode){
          case "img":
            result+="<img src='"+input[i].img+"'></img>";
            break;
          case "text":
            result+="<p>"+input[i].text+"</p>";
            break;
          case "imgtl":
            result+=`<div class="imgtl"><div>${input[i].withTitle ? `<h4>${input[i].title}</h4>` : ``}<p>${input[i].text}</p></div><img src="${input[i].img}"/></div>`;
            break;
          case "imgtr":
            result+=`<div class="imgtr"><img src="${input[i].img}"/><div>${input[i].withTitle ? `<h4>${input[i].title}</h4>` : ``}<p>${input[i].text}</p></div></div>`;
            break;
        }
    }
    return result;
};

module.exports = router;
