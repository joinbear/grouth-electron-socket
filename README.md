# grouth-electron-socket
use electron , express and socket to creeper website page and write to excel  

# problems
1、The data path is different in diffrent os;the solution is use nodejs require('os').homedir() and write files to the home of user;
2、When packager to *.asar file.The *.asar file is readonly; 
3、When the app is close.The port of express will be kill.