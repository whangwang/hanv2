var express = require('express');
var router = express.Router();
var data = require('../data/data.json');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home | Han Wang' });
});

router.get('/list/:cate', function(req, res, next) {
  let rdata = [];
  let rtitle = "網頁<br>開發";
  let rengtitle = "Development";
  switch(req.param('cate')){
    case "webdev":
      rtitle = "產品開發";
      rengtitle = "Development";
      break;
    case "uidesign":
      rtitle = "介面設計";
      rengtitle = "UI/UX Design";
      break;
    case "graphic":
      rtitle = "平面設計";
      rengtitle = "Graphic Design";
      break;
    case "typography":
      rtitle = "標準字設計";
      rengtitle = "Typography";
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
        res.render('cateList', { title: rengtitle+' protfolio | Han Wang', cate: req.param('cate'), cateTitle: rtitle, cateEngTitle: rengtitle, data: rdata });
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
    res.render('cateList', { title: rengtitle+' protfolio | Han Wang', cate: req.param('cate'), cateTitle: rtitle, cateEngTitle: rengtitle, data: rdata });
  }
});

router.get('/detail/:id', function(req, res, next) {
    let td = data.collect[req.param('id')];
    res.render('detail', { title: td.Title+' | Han Wang', data: td, content: parser(td.Content) });
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
