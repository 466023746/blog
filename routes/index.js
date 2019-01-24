const router = require('koa-router')();
const controller = require('../controller');

router.get('/', controller.page);
router.get('/posts', controller.page);
router.get('/pages', controller.page);

router.get('*', controller.post);

module.exports = router;
