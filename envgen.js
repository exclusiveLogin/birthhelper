let fs = require('fs');
let envPath = 'env.js';

if(!!fs.existsSync(envPath)){
    let env = {};

    env['baseUrl'] = process.env['BASE_URL'] || null;
    env['fileServer'] = process.env['FILE_URL'] || null;
    env['backend'] = process.env['BACK_URL'] || null;
    env['static'] = process.env['STATIC_URL'] || null;

    fs.writeFileSync(envPath, 'module.exports = ' + JSON.stringify(env, null, 4), 'utf8');

    console.log('success env generated');
} else{

    console.log('env.json not exist');
}
