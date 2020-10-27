let mongoose = require('mongoose');
let autoIncrement = require('mongoose-plugin-autoinc');

let Schema = mongoose.Schema;

let Portfolio = new Schema({
    title: { type: String, default: '' }, //作品標題
    cateogry: [{
        type:Number,
        default: 1
    }], //作品種類 -> 1=web 2=ui 3=design 4=typography
    cover: { type:String, default: '' }, //封面圖
    description: { type:String, default: '' }, //描述
    info: [{
        name: { type:String, default: '' },
        content: { type:String, default: '' }
    }],
    content: [{
        type: { type:Number, default: '' }, // content種類
        img: [
            { type:String, default: '' }
        ],
        content: [
            { type:String, default: '' }
        ]
    }],
});

let Model = mongoose.model('Portfolio', Portfolio);

Model.insert = function(data, callback) {
    Model(data).save((err, rsp) => {
        callback(err, rsp);
    });
};

Model.delete = function(data, callback) {
    Model.remove(data, (err, rsp) => {
        callback(err, rsp);
    });
};


Model.list = function(data, callback) {
    Model.find(data).
    exec((err, rsp) => {
        callback(err, rsp);
    });
}

Model.has = function(data, callback) {
    Model.findOne(data, (err, rsp) => {
        if (rsp == null) {
            callback(err, false);
        } else {
            callback(err, true);
        }
    });
};

module.exports = Model;
