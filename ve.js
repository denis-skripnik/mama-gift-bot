const conf = require('./config.json');
const lvl = require('./levels.json');
const botjs = require("./bot");
const bdb = require("./bestdb");
const adb = require("./adminsdb");
const gdb = require("./gamerdb");

async function keybord(variant) {
    var buttons = [];
    if (variant === 'home') {
let bests = await bdb.findAllBests();
if (bests.length > 0) {
for (let best of bests) {
buttons.push(best.name);
}
}
buttons.push('Добавить');
}     else if (variant === 'mama') {
    buttons = ["Баланс","Задания"];
}     else if (variant === 'cansel') {
        buttons = ["Отмена"];
    }
return buttons;
}

async function main(bot, id, my_name, message) {
    if (message.indexOf('start') > -1) {
        let text = `Здравствуйте, ${my_name}. Вы админ.`;
        let btns = await keybord('home');
        await botjs.sendMSG(bot, id, text, btns);
        let user = await adb.getUser(id);
        if (!user) {
                await adb.addUser(id, '', 'start');
        }
    } else if (message.indexOf('Добавить') > -1) {
        let user = await adb.getUser(id);
        await adb.updateUser(id, user.status, 'Добавить');
    let text = `Добавьте новое достижение героини. Введите название:`;
    let btns = await keybord('cansel');
    await botjs.sendMSG(bot, id, text, btns);
} else if (message.indexOf('Назад') > -1 || message.indexOf('Отмена') > -1) {
    let user = await adb.getUser(id);
    await main(bot, id, my_name, user.prev_status);
} else {
    let user = await adb.getUser(id);
    console.log('Статус: ' + user.status);
    if (user.status === 'Добавить') {
    await adb.updateUser(id, user.status, 'bestƵ' + message);
        let text = `Добавление достижения. Введите число баллов, которое оно даст:`;
        await bdb.updateBest(message, 0);
        let btns = await keybord('cansel');
    await botjs.sendMSG(bot, id, text, btns);
} else if (user.status.indexOf('bestƵ') > -1) {
    await adb.updateUser(id, user.status, 'start');
        let name = user.status.split('Ƶ')[1];
        let text = `Достижение успешно добавлено!`;
        await bdb.updateBest(name, message);
        let btns = await keybord('home');
    await botjs.sendMSG(bot, id, text, btns);
}
let best = await bdb.getBest(message);
if (best && message.indexOf('bestƵ') === -1) {
    let login = await gdb.getUser(conf.mama_id);
    if (login && best.points !== 0) {
let points = login.points + parseInt(best.points);
var now_level = 0;
for (let n in lvl) {
    if (points >= lvl[n].points && lvl[n+1] && points < lvl[n+1].points) {
        now_level = lvl[n].level;
    } else if (points >= lvl[n].points && !lvl[n+1]) {
        now_level = lvl[n].level;
    }
}
if (login.level < now_level) {
    let keybord_list = await keybord('mama');
    await botjs.sendMSG(bot, conf.mama_id, 'Поздравляем! Ваш уровень повышен. Сейчас он равен ' + now_level + '! Бонус к баллам составил '+ now_level + '%.', keybord_list);
}
await gdb.updateUser(conf.mama_id, now_level, points, login.prev_status, login.status);
await bdb.removeBest(best.name);
let btns = await keybord('mama');
await botjs.sendMSG(bot, conf.mama_id, 'ВНИМАНИЕ, достижение! ' + message + '. Оно дало вам ещё ' + best.points + ' баллов.', btns);
}
}

}
}

        module.exports.main = main;