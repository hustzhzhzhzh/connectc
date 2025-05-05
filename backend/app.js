const express = require('express'); // 引入 Express
const cors = require('cors'); // 安装：npm install cors
const mysql = require('mysql2/promise');

const app = express(); // 初始化 Express 应用
app.globalData = { // 全局存储用户信息
  userInfo: null
};
// 启用 CORS
app.use(cors({origin: '*' // 开发环境允许所有来源
}));
app.use(express.json());

// 动态导入 node-fetch
let fetch; // 声明变量

(async () => {
  try {
    const module = await import('node-fetch');
    fetch = module.default; // 获取默认导出
  } catch (err) {
    console.error('动态导入 node-fetch 失败:', err);
    process.exit(1); // 终止进程
  }
})();

// 测试动态导入是否成功
setTimeout(() => {
  if (!fetch) {
    console.error('fetch 未加载！');
  } else {
    console.log('fetch 加载成功！');
  }
}, 1000);


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'zh040218', // 你的密码
  database: 'study_abroad',
  waitForConnections: true,
  connectionLimit: 10
});
// 在app.js中添加
const APPID = 'wxa53c7dd4b90dfb22'; // 在微信后台查看
const SECRET = 'c035584693e6be228abe420c31847b11';

// 微信登录接口
app.post('/api/wechat-login', async (req, res) => {
  console.log('微信登录请求参数:', req.body); // 查看是否收到 code 参数

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({  success: false, error: '缺少code参数' });
  }
  if (!fetch) {
    return res.status(500).json({success: false, error: 'fetch 未初始化' });
  }

  try {
    // 1. 调用微信接口换取openid
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.errcode) {
      console.error('微信接口错误:', data);
      return res.status(400).json({  success: false, error: data.errmsg });
    }

    const { openid } = data;

    // 存入数据库
    const [result] = await pool.query(
      'INSERT INTO users (wechat_openid) VALUES (?) ON DUPLICATE KEY UPDATE last_login=NOW()',
      [openid]
    );

    res.json({ 
      success: true, 
      userId: result.insertId  
    });

  } catch (err) {
    console.error('登录处理失败:', err);
    res.status(500).json({  success: false, error: '服务器错误' });
  }

});

// 测试数据库连接
// // 修改后的后端代码（app.js）
// app.post('/test-db', async (req, res) => { // 改为 POST 方法
//   try {
//     const [rows] = await pool.promise().query('SELECT 1 + 1 AS solution');
//     res.json({ success: true, data: rows[0].solution }); // 返回结构化数据
//   } catch (err) {
//     console.error('数据库查询失败:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

app.post('/api/posts', async (req, res) => {
  console.log('请求体:', req.body); 
  const { userId, title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ success: false, error: '标题和内容必填' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );
    res.json({ postId: result.insertId });
  } catch (err) {
    console.error('发帖失败:', err);
    res.status(500).json({success: false,  error: '服务器错误' });
  }
});
// 获取帖子列表
app.get('/api/getposts', async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT 
        posts.id, 
        posts.user_id,
        posts.title, 
        posts.content, 
        posts.created_at,
        users.wechat_openid AS author
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    
    res.json(posts);
    
  } catch (err) {
    console.error('获取帖子失败:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});
// 启动服务器（可选）
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});