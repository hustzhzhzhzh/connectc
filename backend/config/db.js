const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'zh040218', // 改成你的MySQL密码
  database: 'study_abroad',
  waitForConnections: true,
  connectionLimit: 10,
});

