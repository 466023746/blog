const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

md.use(require('markdown-it-front-matter'), function(fm) {
  if (fm) {
    global.mdFm = fm.split(/\n/g).reduce((prev, item) => {
      const arr = item.split(':');
      const key = arr[0].trim();
      let val = arr[1].trim();

      // 标签数组
      if (key === 'tags') {
        val = val.split(',').map(item => item.trim())
      }

      // 日期格式化
      if (key === 'date') {
        const d = new Date(val);
        val = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join("/")
      }

      prev[key] = val;

      return prev;
    }, {})
  }
});

module.exports = (content) => {
    return md.render(content);
};
