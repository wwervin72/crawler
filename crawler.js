const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const http = require('http');
// const url = require('url');
const cheerio = require('cheerio');
// const fs = require('fs');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("X-Powered-By",' 3.2.1');
    if(req.method === "OPTIONS") {
    	res.sendStatus(200);
    }else{
    	next();
    }  
});

app.use(bodyparser.urlencoded({extended: false}));

app.use(bodyparser.json());

app.get('/', (req, res) => {
	res.status(200).write('welcome to ervin\'s book reader')
	res.end();
});

app.get('/search', (req, res) => {
	http.get('http://www.zhuishushenqi.com/search?val=' + global.encodeURIComponent(req.query.title), result => {
		if(result.statusCode === 200){
			result.setEncoding('utf8');
			let body = '';
			result.on('data', chunk => {
				body += chunk;
			});
			result.on('end', () => {
				let data = {};
				$ = cheerio.load(body);
				// 添加搜索到的数据条数
				data.count = $('.content .title span').eq(0).text();
				data.list = [];
				$('.content > .books-list > .book').each((index, item) => {
					item = cheerio.load(item);
					data.list[data.list.length] = {
						url: 'http://www.zhuishushenqi.com' + item('.book').attr('data-href'),
						avatar: item('.cover').attr('src'),
						author: item('p.author span').eq(0).text(),
						cat: item('p.author span.cat').text(),
						abstract: item('.desc').text(),
						popularity: item('.popularity > span').eq(0).text(),
						retained: item('.popularity > span').eq(2).text(),
					};
				});

				return res.status(200).json({
					result: 200,
					data: data
				});
			});
		}	
	});
});

app.get('/read', (req, res) => {
	let book = req.query.bookId,
		chapters = req.query.chapter;
		chapters = chapters ? chapters : 1;
	http.get('http://www.zhuishushenqi.com/book/' + book + '/' + chapters + '.html', result => {
		result.setEncoding('utf8');
		if(result.statusCode === 200){
			let body = '';
			result.on('data', chunk => {
				body += chunk;
			});
			result.on('end', () => {
				console.log(body)
				try {
					let $ = cheerio.load(body);
					return res.status(200).json({
						result: true,
						data: {
							content: $('.inner-text').text().trim(),
							title: $('.current-chapter').text(),
							name: $('.current-chapter').prev().text()
						}
					})
				} catch (err) {
					throw err;
					return res.status(500).json({
						result: false,
						data: 'server error'
					});
				}
			});
		}else{
			return res.status(500).json({
				result: false,
				data: 'server error'
			});
		}
	}).on('error', err => {
		throw err;
		return res.status(500).json({
			result: false,
			data: 'server error'
		});
	});
});

app.get('/chapters', (req, res) => {
	http.get('http://www.zhuishushenqi.com/book/' + req.query.bookId, result => {
		result.setEncoding('utf8');
		if(result.statusCode === 200){
			let body = '';
			result.on('data', chunk => {
				body += chunk;
			});
			result.on('end', () => {
				let $ = cheerio.load(body);
				let data = [];
				$('#J_chapterList > li').each((index, item) => {
					item = cheerio.load(item)('a');
					data[data.length] = {
						url: item.attr('href'),
						content: item.text(),
						bookId: item.attr('href').split('/')[3]
					};
				});
				try {
					return res.status(200).json({
						result: true,
						data
					});
				} catch (error) {
					throw error;
					return res.status(500).json({
						result: false,
						data: 'server error'
					});
				}
			});
		}else{
			throw err;
			return res.status(500).json({
				result: false,
				data: 'server error'
			});
		}
	}).on('error', err => {
		throw err;
		return res.status(500).json({
			result: false,
			data: 'server error'
		});
	});
});

app.listen(3000, function () {
	console.log('server is running at port 3000');
})
