const conf = require('./config.json');
const TeleBot = require('telebot');
const bot = new TeleBot('1023906391:AAEL-UxzpB_td9QjYcTC5P6bLNVD3g1RjE0');
bot.start();
const CronJob = require('cron').CronJob;

const mama = require("./mama");
const ve = require("./ve");

async function ids(uid) {
    if (uid === conf.mama_id) {
        return {status: 1, id: uid};
    } else if (conf.admins.indexOf(uid) > -1) {
        return {status: 2, id: uid};
    } else {
        return {status: 0};
    }
}

async function allCommands() {
    bot.on('text', async (msg) => {
        var uid = await ids(msg.from.id);
        var my_name = msg.from.first_name + ' ' + msg.from.last_name;
if (uid.status === 1) {
    await mama.main(bot, uid.id, my_name, msg.text);
} else if (uid.status === 2) {
    await ve.main(bot, uid.id, my_name, msg.text);
}
});
}

async function run() {
    await allCommands();
}
run();
new CronJob('0 59 20 10 3 *', mama.timeSend, null, true);    