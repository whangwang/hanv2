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
    let eachLine = input.split('{');
    let result = "";
    for(let i = 0; i < eachLine.length; i++){
      if(eachLine[i].trim()!=""){
        let line = eachLine[i].split('}')[0];
        let detector = line.split(' ');
        let text = "";
        switch(detector[0]){
          case "img":
            result+="<img src='"+detector[1]+"'></img>";
            break;
          case "imgt":
            text = "";
            for(var j = 2;j < detector.length; j++)text+=(j==2)?detector[j]:" "+detector[j];
            result+="<img src='"+detector[1]+"'></img><h5>"+text+"</h5>";
            break;
          case "2img":
            result+='<div class="half-img"><img src="'+detector[1]+'"><img src="'+detector[1]+'"></div>';
            break;
          case "2imgt":
            text = "";
            for(var j = 3;j < detector.length; j++)text+=(j==3)?detector[j]:" "+detector[j];
            result+='<div class="half-img"><img src="'+detector[1]+'"><img src="'+detector[2]+'"><h5>'+text+'</h5></div>';
            break;
          case "lh":
            text = "";
            for(var j = 1;j < detector.length; j++)text+=(j==1)?detector[j]:" "+detector[j];
            result+='<h4>'+text+'</h4>';
            break;
          case "mh":
            text = "";
            for(var j = 1;j < detector.length; j++)text+=(j==1)?detector[j]:" "+detector[j];
            result+='<h3>'+text+'</h3>';
            break;
          case "p":
            text = "";
            for(var j = 1;j < detector.length; j++)text+=(j==1)?detector[j]:" "+detector[j];
            result+='<p>'+text+'</p>';
            break;
          case "list":
            text = "";
            let li="";
            for(var j = 1;j < detector.length; j++)text+=(j==1)?detector[j]:" "+detector[j];
            let list = text.split('|');
            for(var j = 0;j < list.length;j++)li+="<li>"+list[j]+"</li>";
            result+='<ul style="padding-left: 20px;font-weight: 400;">'+li+'</ul>';
            break;
          case "rwd":
            result+="<div class='webview-display'><img src='"+detector[1]+"'></img><img src='"+detector[2]+"'></img></div>";
            break;
          case "rwdt":
            text = "";
            for(var j = 3;j < detector.length; j++)text+=(j==3)?detector[j]:" "+detector[j];
            result+="<div class='webview-display'><img src='"+detector[1]+"'></img><img src='"+detector[2]+"'></img></div><h5>"+text+"</h5>";
            break;
        }
      }
    }
    return result;
};

module.exports = router;
