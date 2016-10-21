const { app , BrowserWindow } = require('electron');
let mainWindow = null;

// create window function
function createWindow() {
	
	// create browser window
	mainWindow = new BrowserWindow({
		width : 1024,
		height : 768
	});
	// Instantiate Express App
  app.server = require(__dirname + '/app/app')();
	// load the entry file of the app
	mainWindow.loadURL('http://localhost:5000');
	
	// Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  
}
// create window when the app is ready
app.on('ready',createWindow);

// bind close event
app.on('window-all-closed',()=>{
	// if the platform is not mac os close the app
	if(process.platform != 'darwin'){
		app.quit();
	}
});

// review app for mac os
app.on('activate',()=>{
	if(mainWindow === null){
		createWindow();
	}
});
