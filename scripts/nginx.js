const fs = require('fs');
const path = require('path');

const SERVE_ENV = process.env.SERVE_ENV || 'sit';

const proxy_list = {
    sit: 'http://192.168.149.209:32000',
    uat: 'http://192.168.149.209:32000',
    dev: 'http://192.168.149.209:32000',
    production: 'http://192.168.133.212:33000',
};
const file_path = path.join(__dirname, '../docker/nginx/conf.d');
const template = fs.readFileSync(file_path + '/default.temp', {
    encoding: 'utf-8',
});

const conf = template.replace(/{{ip}}/g, proxy_list[SERVE_ENV]);

console.log('代理地址', proxy_list[SERVE_ENV]);

fs.writeFileSync(file_path + '/default.conf', conf, { encoding: 'utf-8' });
