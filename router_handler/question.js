// 导入数据库操作模块
const {
    type
} = require('express/lib/response')
const db = require('../db/index')

// 获取问题评论
exports.getAllComment = (req, res) => {
    const qid = req.query.qid
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `SELECT comment.content,comment.created_at,user.username
    FROM comment RIGHT JOIN user on comment.uid = user.id WHERE comment.qid = ?`
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, qid, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)
        // console.log(results);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (!results.length) return res.cc('获取评论失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            code: 200,
            msg: '获取评论成功！',
            data: results,
        })
    })
}

// 获取问题列表
exports.getAllQuestion = (req, res) => {
    var num = req.query.num;
    // console.log(req.query);
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    let sql = `SELECT question.id, question.title,question.type,question.is_hot,question.created_at,answer.content,user.username,(select count(*) FROM comment WHERE comment.qid = question.id) as c_count FROM question LEFT JOIN answer ON answer.qid = question.id LEFT JOIN user ON question.uid = user.id LEFT JOIN comment ON comment.uid = question.id`

    if (num < 3) {
        sql += ` WHERE question.type = ${num}`
    }else if(num==3){
        sql += ` WHERE question.is_hot = 1`
    }

    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, (err, results) => {
        // console.log(sql);
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (!results.length) return res.cc('获取问题列表失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            code: 200,
            msg: '获取问题列表成功！',
            data: results,
        })
    })
}

//添加新问题
exports.addQuestion = (req, res) => {
    // 接收表单数据
    const questionInfo = req.body
    // 判断数据是否合法
    if (!questionInfo.title) {
        return res.cc('问题不能为空！')
    }
    const sql = 'insert into question set ?'
    db.query(sql, {
        uid: questionInfo.uid,
        title: questionInfo.title,
        type: questionInfo.type,
        created_at: questionInfo.created_at
    }, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // SQL 语句执行成功，但影响行数不为 1
        if (results.affectedRows !== 1) {
            return res.cc('添加问题失败，请稍后再试！')
        }
        // 注册成功
        res.cc('添加成功！', 200)
    })


}

//添加新评论
exports.addComment = (req, res) => {
    // 接收表单数据
    const commentInfo = req.body
    // 判断数据是否合法
    if (!commentInfo.content) {
        return res.cc('内容不能为空！')
    }
    const sql = 'insert into comment set ?'
    db.query(sql, {
        uid: commentInfo.uid,
        qid: commentInfo.qid,
        content: commentInfo.content,
        created_at: commentInfo.created_at
    }, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // SQL 语句执行成功，但影响行数不为 1
        if (results.affectedRows !== 1) {
            return res.cc('添加评论失败，请稍后再试！')
        }
        // 注册成功
        res.cc('添加成功！', 200)
    })


}