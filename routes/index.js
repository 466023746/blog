const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json2'
  }
})

router.get('/web-worker', async (ctx, next) => {
    await ctx.render('web-worker', {
        title: 'Web Worker!'
    })
})

router.get('/web-worker2', async (ctx, next) => {
    await ctx.render('web-worker', {
        title: 'Web Worker2!'
    })
})

module.exports = router
