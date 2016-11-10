const fs              = require('fs-extra');
const path            = require('path');
const CreeperModel    = require('./javascript/creeper');
const schedule        = require('node-schedule');
const express         = require('express');
const rule            = new schedule.RecurrenceRule();  
const times           = [8,9,10,11,12,13,14,15,16,17,18,19,20,21];  
/**
 * [zhilian zhilian实例参数对象]
 * @type {Object}
 */
const zhilian = {
	url : 'http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E6%88%90%E9%83%BD&sm=0&p=1&kw=',
	keywords : ['销售','销售代表','销售业务','销售经理','业务','业务代表','置业顾问','实习','市场营销','营销'],
	tabName : '智联',
	domList : {
		list : '#newlist_list_div .newlist',
		child : '.gsmc a'
	}
}
/**
 * [wuba 58实例参数对象]
 * @type {Object}
 */
const wuba = {
	url : 'http://cd.58.com/job/?utm_source=market&spm=b-31580022738699-me-f-824.bdpz_biaoti&PGTID=0d100000-0006-6617-9116-32a591713312&ClickID=2&key=',
	keywords : ['销售','销售代表','销售业务','销售经理','业务','业务代表','应届','实习','市场营销','营销','置业顾问'],
	tabName : '58同城',
	domList : {
		list : '#infolist dl',
		child : '.w271 a'
	}
}
/**
 * [job51 job51实例参数对象]
 * @type {Object}
 */
const job51 = {
	url : 'http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea=090200%2C00&funtype=0000&industrytype=00&keywordtype=2&lang=c&stype=2&postchannel=0000&fromType=1&confirmdate=9&keyword=',
	keywords : ['销售','销售代表','销售经理','业务','业务员','销售业务','市场营销','营销','应届','实习','置业顾问'],
	tabName : '51job',
	domList : {
		list : '#resultList .el',
		child : '.t2 a'
	}
}
module.exports = ()=>{
	const app    = new express();
	const server = require('http').createServer(app).listen(5000);
	const io     = require('socket.io')(server);
	app.use(express.static(path.join(__dirname ,'javascript') ));
	app.use(express.static(path.join(__dirname ,'stylesheet') ));
	app.get('/',(req,res)=>{
		res.sendFile(__dirname + '/index.html');
	});
	app.get('/config',(req,res)=>{
		res.sendFile(__dirname + '/config.html');
	});
	io.on('connection',(socket)=>{
	  socket.on('disconnect',()=>{

	  });
	  io.emit('loading',{
			message : '抓取程序启动'
		});
		zhilian.socket       = socket;
		wuba.socket          = socket;
		job51.socket         = socket;
		// 智联招聘实例化
		const zhilianCreeper = new CreeperModel(zhilian);
		// 58招聘实例化
		const wubaCreeper    = new CreeperModel(wuba);
		// 51job招聘实例化
		const job51Creeper   = new CreeperModel(job51);
		//定时任务
		rule.hour   = times;
		rule.minute = 0;  
		schedule.scheduleJob(rule,()=>{
			socket.emit('message',{
				message : '==========定时任务执行成功==========='
			});
			// console.log('==========定时任务执行成功===========');  
			runTask();
		}); 
		runTask();

		/**
		 * [runTask 任务执行方法]
		 * @return {[type]} [description]
		 */
		function runTask(){
			zhilianCreeper.init();
			wubaCreeper.init();
			job51Creeper.init();
		}
	});
}


