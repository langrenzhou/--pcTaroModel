const express = require('express');
const mysql = require('mysql');
const link = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '010527',
    database: 'ledutaro',
})
link.connect()
const app = express()
// 请求所有类型列表
app.get('/type', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const check = 'select * from t_types';
    link.query(check, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            res.end(err)
        }
    })
})
//根据发送过来的id请求文章列表
app.all('/content', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    
    const id=req.query.id
    const page=parseInt(req.query.page-1)*10
    const check = `select * from t_articles where type_id=${id} limit ${page},10`;
    link.query(check,function(err,result){
        if(err){
         console.log(err)
        }else{
            res.send(result)
            res.end(err)
        }
    })
    

})
//请求总页数
app.all('/pages', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const id=req.query.id
    const check = `select * from t_articles where type_id=${id}`;
    link.query(check,function(err,result){
        if(err){
         console.log(err)
        }else{
            res.send(result)
            res.end(err)
        }
    })
    

})
app.listen('8080', function () {
    console.log('127.0.0.1:8080')
})