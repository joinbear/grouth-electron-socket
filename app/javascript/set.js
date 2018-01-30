const fs         = require('fs-extra');
// before require the lib, we should use npm install node-xlsx --save;
const dataPath   = require("os").homedir() + '/creeper/';
const utils      = {
	/**
	 * [readFile 根据path同步读取数据]
	 * @param  {[type]} path [文件坐在路径]
	 * @return {[type]}      [description]
	 */
	readFile : function(path){
		try{
			return fs.readFileSync(path,{encoding:'utf8'});
		}catch(error) {
			return [];
		}
		
	},
	/**
	 * [createPath 生成文件路径]
	 * @param  {[type]} fileName [文件名称]
	 * @return {[type]}          [description]
	 */
	createPath : function(fileName){
		//console.log(dataPath + fileName);
		return dataPath + fileName;
	},
	/**
	 * [writeFile 写入文件]
	 * @param  {[type]} path      [路径]
	 * @param  {[type]} data      [数据]
	 * @param  {[type]} showError [是否显示错误信息]
	 * @return {[type]}           [description]
	 */
	writeFile : function(path,data,showError){
		try {
      fs.outputFile(path,data);
      if(showError) return true;
    }catch(err) {
    	return err.toString();
    }
	},
	emptyDir:function(){
		try {
      fs.emptyDirSync(dataPath)
      return true;
    }catch(err) {
    	return err.toString();
    }
		
	}
}
$(".input-group-addon").on('click',function(){
	let configPath = utils.createFile('config.txt');
	let type       = $(this).attr('data-type');
	let content    = $(this).val();
	let data       = utils.readFile(configPath);
	if(!data){
		data = {
			wuba : [],
			zhilian : [],
			wuyi : [],
			hours : [],
			minute : ''
		}
	}
	 
	switch(parseInt(type)){
		case 1:
			data.wuba = content.split(",");
		break;
		case 2:
			data.zhilian = content.split(",");
		break;
		case 3:
			data.wuyi = content.split(",");
		break;
		case 4:
			data.hours = content.split(",");
		break;
		case 5:
			data.wuba = content;
		break;
	}
	console.log(data);
	utils.writeFile(configPath,data);
});