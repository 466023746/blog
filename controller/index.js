const path = require('path');
const fs = require('fs');
const glob = require('glob');
const config = require('../config');
const {mdParse} = require('../utils')

const {root} = config;

module.exports = {
  async page(ctx) {
    let dir = ctx.path;
    if (dir === '/') dir = '/posts';
    const renderFile = dir.substring(1);
    const files = glob.sync(`${root}/public${dir}/**/*.md`);

    const result = await Promise.all(files.map(async (item) => {
      const name = path.basename(item, '.md');
      const fileData = await fs.readFileAsync(item, 'utf8');
      // eslint-disable-next-line
      const mdData = mdParse(fileData);

      return {
        ...global.mdFm,
        permalink: `${dir}/${name}`
      }
    }));

    await ctx.render(renderFile, {type: dir, pages: result});
  },
  async post(ctx) {
    const file = ctx.path + '.md';
    const renderFile = path.dirname(file).replace(/s$/, '').substring(1);

    try {
      const fileData = await fs.readFileAsync(`${root}/public${file}`, 'utf8');
      const mdData = mdParse(fileData);

      await ctx.render(renderFile, {
        ...global.mdFm,
        body: mdData
      })
    } catch (e) {
      await ctx.render('error');
    }
  }
};
