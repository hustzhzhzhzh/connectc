-- 创建数据库（如果不存在）
-- ----------------------------
CREATE DATABASE IF NOT EXISTS study_abroad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE study_abroad;

-- ----------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT COMMENT '用户ID（主键，自增）',
  name VARCHAR(100) DEFAULT NULL COMMENT '用户姓名（可选）',
  phone VARCHAR(11) NOT NULL COMMENT '用户手机号（11位数字）',
  avatar_url VARCHAR(255) COMMENT '用户头像URL（可选）',
  wechat_openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信开放ID（唯一标识，必填）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间',
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间（默认当前时间）',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

USE study_abroad;
CREATE TABLE IF NOT EXISTS  posts (
  id INT AUTO_INCREMENT PRIMARY KEYCOMMENT '帖子ID（主键，自增）',
  user_id INT COMMENT '用户ID（外键，关联users表）',
  title VARCHAR(200) COMMENT '帖子标题',
  content TEXT COMMENT '帖子内容',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '帖子创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子信息表';

