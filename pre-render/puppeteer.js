const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const glob = require('glob');

const root = path.resolve(__dirname, '../');
const staticRoot = 'public';
const pagesRoot = 'pages';
const postsRoot = 'posts';
const pageFiles = glob.sync(`${staticRoot}/${pagesRoot}/**/*.md`);
const postFiles = glob.sync(`${staticRoot}/${postsRoot}/**/*.md`);
const basePath = 'https://466023746.github.io/blog/#/';
const viewRoot = path.join(root, 'views');

const urls = [
    `${basePath}${staticRoot}/${pagesRoot}`,
    `${basePath}${staticRoot}/${postsRoot}`,
        ...genMdUrls(pageFiles),
        ...genMdUrls(postFiles),
];

(async () => {
    const browser = await puppeteer.launch();

    urls.forEach(async item => {
        const page = await browser.newPage();
        await page.goto(item, {waitUntil: 'networkidle0'});
        const html = await page.content();
        let viewPath = item.replace(`${basePath}${staticRoot}`, '') + '.html';
        viewPath =  path.join(viewRoot, viewPath);

        fs.writeFile(viewPath, html, (err) => {
            if (err) throw err;
            console.info(`Create file ${viewPath}`);
        })
    });

    // await browser.close();
})();

function genMdUrls(files) {
    return files.map(item => {
        return `${basePath}${item.replace(path.join(root, staticRoot))}`.replace(/\.md$/, '')
    })
}

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.kaola.com', {waitUntil: 'networkidle2'});
//     await page.pdf({path: 'hn.pdf', format: 'A4'});
//
//     await browser.close();
// })();

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.kaola.com');
//
//     // Get the "viewport" of the page, as reported by the page.
//     const dimensions = await page.evaluate(() => {
//         return {
//             width: document.documentElement.clientWidth,
//             height: document.documentElement.clientHeight,
//             deviceScaleFactor: window.devicePixelRatio
//         };
//     });
//
//     console.log('Dimensions:', dimensions);
//
//     await browser.close();
// })();
