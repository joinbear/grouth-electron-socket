// before require the lib, we should use npm install jquery --save;
const { BrowserWindow } = require('electron').remote;

$('#config').on('click', function(event) {

	event.preventDefault();
	let win = new BrowserWindow({width: 1024, height: 768 , fullscreen : false});
	// win.loadURL('http://localhost:5000/config');
	win.loadURL(`file://${__dirname}/app/config.html`);
	let webContents = win.webContents;
	if(true){
		webContents.openDevTools();
	}
	
});

var socket = io('http://localhost:5000');
socket.on('message',function(data){
	$('#show-box').append('<p class="list-item">'+data.message+'</p>');
})
socket.on('loading', function (data) {
	$('#show-box').append('<p class="list-item">'+data.message+'</p>');
});