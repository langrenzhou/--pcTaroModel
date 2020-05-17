const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable')
const link = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '010527',
    database: 'ledutaro',
})
link.connect()
const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
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

    const id = req.query.id
    const page = parseInt(req.query.page - 1) * 10
    const check = `select * from t_articles where type_id=${id} limit ${page},10`;
    link.query(check, function (err, result) {
        if (err) {
            console.log(err)
        } else {
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
    const id = req.query.id
    const check = `select * from t_articles where type_id=${id}`;
    link.query(check, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            res.end(err)
        }
    })


})
//登录接口
app.all("/login", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const ReqBody = Object.keys(req.body)[0]
    var dataJson = ''
    dataJson += ReqBody
    const data = JSON.parse(dataJson)
    const check = `select * from t_users where (username='${data.userName}'  or nikiname='${data.userName}') and password='${data.passWord}'`;
    link.query(check, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            res.end(err)
        }
    })


})
//注册接口
app.all("/register", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const ReqBody = Object.keys(req.body)[0]
    var dataJson = ''
    dataJson += ReqBody
    const data = JSON.parse(dataJson)
    const check = `select * from t_users where username='${data.userName}';`;
    link.query(check, function (err, result) {
        console.log(result)
        if (result.length) {
            res.send("该用户名已被注册")
            res.end(err)
        } else {
            const check = `select * from t_users where email='${data.userEmail}';`
            link.query(check, function (err, result) {
                if (result.length) {
                    res.send("该邮箱已被注册");
                    res.end(err)
                } else {
                    const check = `insert into t_users (username,nikiname,password,email) value ('${data.userName}','${data.nikName}','${data.passWord}','${data.userEmail}')`
                    link.query(check, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send(result)
                            res.end(err)
                        }
                    })
                }
            })
        }

    })

})
//top前10列表
app.all('/TopTen', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const id = req.query.id
    const check = `select * from t_articles  where type_id=${id} order by play_time desc limit 0,10`;
    link.query(check, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            res.end(err)
        }
    })


})
//详情页面
app.all('/details', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Headers", "content-type"); //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const id = req.query.id
    const check = `select * from t_articles  where id=${id}`;
    link.query(check, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            res.end(err)
        }
    })


})
app.listen('8080', function () {
    console.log('127.0.0.1:8080')
})