let fs = require('fs');
let envPath = 'env.js';

if(!!fs.existsSync(envPath)){
    let env = {};

    env['baseUrl'] = process.env['BASE_URL'];
    env['fileServer'] = process.env['FILE_URL'];
    env['backend'] = process.env['BACK_URL'];
    env['static'] = process.env['STATIC_URL'];

    fs.writeFileSync(envPath, 'module.exports = ' + JSON.stringify(env, null, 4), 'utf8');

    console.log('success env generated');
} else{

    console.log('env.json not exist');
}
