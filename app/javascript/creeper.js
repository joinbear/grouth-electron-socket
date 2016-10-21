const path     = require('path');
const fetch    = require('node-fetch');
const cheerio  = require('cheerio');
const co       = require('co');
const	xlsx     = require('node-xlsx');
const	fs       = require('fs-extra');
const	Entities = require('html-entities').XmlEntities;
const entities = new Entities();

/**
 * 招聘数据抓取model类
 */
class CreeperModel {
	/**
	 * [constructor 构造函数]
	 * @param  {String} options.url      [抓取页面地址，不包含keyword关键词]
	 * @param  {Array}  options.keywords [关键词数组]
	 * @param  {String} options.tabName  [表名]
	 * @param  {Object} options.domList  [列表元素的domList list 列表元素容器对象 child 公司元素对象]
	 * @return {[type]}                  [description]
	 */
	constructor({ url = '',keywords = [],tabName = '',domList = {} , socket = {} }) {
		this.url        = url;
		this.domList    = domList;
		this.keywords   = keywords;
		this.tabName    = tabName;
		this.xlsxHeader = ['关键词','招聘信息总数','链家信息数','占比百分比'];
		this.fetchAll   = this.fetchAll.bind(this);
		this.fetchData  = this.fetchData.bind(this);
		this.writeExecl = this.writeExecl.bind(this);
		this.socket     = socket;
	}
	// 初始化
	init() {
		const { fetchAll , writeExecl , xlsxHeader ,tabName , socket} = this;
		const loadingMsg = '===========抓取'+tabName+'开始============';
		// console.log(loadingMsg);
		socket.emit('message',{
			message : loadingMsg
		});
		co(function*(){
			let result = yield fetchAll();
			result.unshift(xlsxHeader);
			writeExecl(tabName,result);
		});
	}
	/**
	 * 遍历抓取关键词请求
	 */
	fetchAll() {
		const { keywords , url , domList , fetchData } = this;
		return co(function*(){
			const tasks = [];
			let result;
			for(let i in keywords){
				let keyword = keywords[i];
				// console.log(keyword);
				tasks[i]    = yield fetchData(url + encodeURIComponent(keyword),domList.list,domList.child,keyword);
				result      = yield Promise.all(tasks);
			}
			return result;
		});
	}
	/**
	 * [fetchData 数据抓取请求]
	 * @param  {[type]} fetchUrl   [请求地址]
	 * @param  {[type]} listDom    [列表容器对象]
	 * @param  {[type]} companyDom [公司元素对象]
	 * @param  {[type]} keyword    [关键词]
	 * @return {[type]}            [description]
	 */
	fetchData(fetchUrl,listDom,companyDom,keyword) {
		const { socket , tabName } = this;
		// console.log(0);
		// return false;
		return co(function*(){
			const response = yield fetch(fetchUrl);
			const result   = yield response.text();
			const $        = cheerio.load(result);
			let count      = 0;
			const datalists= $(listDom);
			const total    = datalists.length;
			datalists.each(function(index,element){
				if(index > 0){
					const txt     = $(element).find(companyDom).text();
					const company = entities.decode(txt);
					const reg     = /链家/;
					if(company.match(reg)){
						count++;
					}
				}
			});
			const back = [keyword,total,count,Math.floor(count/total*100) + '%'];
			socket.emit('message',{
				message : tabName + "--->[" + back.join(",") + "]"
			});
			// console.log(back);
			return back;
		});
	}
	/**
	 * [writeExecl 写入excel]
	 * @param  {[type]} tabName     [文件名]
	 * @param  {[type]} finalResult [写入结果]
	 * @return {[type]}             [description]
	 */
	writeExecl(tabName,finalResult) {
		const { socket } = this;
		const date       = new Date();
		const day        = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		const hours      = date.getHours();
		const dirpath    = require("os").homedir() + '/招聘数据抓取/'+ tabName +'/' + day +'/';
		let loadingMsg   = '======开始写入'+tabName+'文件=======';
		socket.emit('message',{
			message : loadingMsg
		});
		// console.log('======开始写入'+tabName+'文件=======');
		const write = function(){
			//写入
		  // var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
		  const buffer = xlsx.build([{name: "inviteCount", data: finalResult}]); // returns a buffer
		  fs.writeFileSync(dirpath + hours + '.xlsx',buffer,'binary');
		  let loadingMsg = '======抓取'+tabName+'结束=======';
		  socket.emit('message',{
				message : loadingMsg
			});
		  // console.log('======写入'+tabName+'成功=======');
		  // console.log('======抓取'+tabName+'结束=======');
		};
	  fs.exists( dirpath , function (exists){	
	  	if(!exists){
	  		fs.mkdirs(dirpath, function (err) {
				  if (err) return console.error(err)
				  write();
				})
	  	}else{
	  		write();
	  	}
	  });
	  
	}

}


module.exports = CreeperModel;
