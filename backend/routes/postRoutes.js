// 测试数据库连接路由
router.post('/test-db', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT 1 + 1 AS result');
      res.json({ success: true, data: rows[0].result });
    } catch (error) {
      console.error('数据库连接失败:', error);
      res.status(500).json({ 
        error: '数据库连接失败',
        details: error.message 
      });
    }
  });