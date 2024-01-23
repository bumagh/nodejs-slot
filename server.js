require('dotenv').config();
var cors = require('cors');
let fs 			  = require('fs');

let express       = require('express');
let app           = express();
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
let port       = process.env.PORT || 2002;
let expressWs  = require('express-ws')(app);
let bodyParser = require('body-parser');
var morgan = require('morgan');
// Setting & Connect to the Database
let configDB = require('./config/database');
let mongoose = require('mongoose');
require('mongoose-long')(mongoose); // INT 64bit
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex',   true);
mongoose.connect(configDB.url, configDB.options); // kết nối tới database
//配置默认管理员帐户和默认数据
require('./config/admin');
// đọc dữ liệu from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('combined'));
app.set('view engine', 'ejs'); // chỉ định view engine là ejs
app.set('views', './views');   // chỉ định thư mục view
// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static('public'));
// server socket
let redT = expressWs.getWss();
process.redT = redT;
global['redT'] = redT;
global.SKnapthe = 2;
global['userOnline'] = 0;
require('./app/Helpers/socketUser')(redT); // Add function socket
require('./routerHttp')(app, redT);   // load các routes HTTP
require('./routerCMS')(app, redT);	//load routes CMS
require('./routerSocket')(app, redT); // load các routes WebSocket
// require('./app/Cron/taixiu')(redT);   // Chạy game Tài Xỉu
// require('./app/Cron/baucua')(redT);   // Chạy game Bầu Cua
require('./config/cron')();
app.listen(port,'127.0.0.1', function() {
    console.log("Server listen on port ", port);
});