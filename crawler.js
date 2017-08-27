const express = require('express');
const app = express();
const bodyparser = require('body-parser');
// const url = require('url');
// const cheerio = require('cheerio');
// const fs = require('fs');


// console.log(global.encodeURIComponent('拯救倚天'))

// let searchUrl = 'http://read.xiaoshuo1-sm.com/novel/i.php?page=1&size=10&rewrite=0&q=%E6%8B%AF%E6%95%91%E5%80%9A%E5%A4%A9&type=0&do=q_paysearch&platform=qsandroid&callback=elf_jsonp_2';

// http.get(searchUrl, res => {
// 	var body = '';
// 	res.setEncoding('utf8');
// 	if(res.statusCode === 200){
// 		res.on('data', chunk => {
// 			body += chunk;
// 		})
// 		res.on('end', () => {
// 			body = body.slice(12, -2)
// 			fs.writeFile('data.json', JSON.stringify(JSON.parse(body)), (err) => {
// 				if(err) throw err;
// 				console.log('finish')
// 			})
// 		})
// 	}
// })

app.use(bodyparser.urlencoded({
	extended: false
}));

app.use(bodyparser.json())

app.get('/', (req, res) => {
	res.status(200).write('welcome to ervin\'s book reader')
	res.end();
});

app.get('/book', (req, res) => {
	console.log(res.query);
});


app.listen(3000, function () {
	console.log('server is running at port 3000');
})
