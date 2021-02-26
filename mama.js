const conf = require('./config.json');
const lvl = require('./levels.json');
const botjs = require("./bot");
const bdb = require("./bestdb");
const tdb = require("./tasksdb");
const gdb = require("./gamerdb");
const mnt = require('./minter_sender')

async function keybord(variant) {
    var buttons = [];
if (variant === 'home') {
        buttons = ["Задания", "Баланс"];
} else if (variant === 'tasks') {
    let tasks = await tdb.findAllTasks();
    if (tasks.length > 0) {
    for (let task of tasks) {
    buttons.push(task.name);
    }
    }
    buttons.push('Назад');
} else if (variant === 'back') {
        buttons = ["Назад"];
    } else if (variant === 'cansel') {
        buttons = ["Отмена"];
    }
    return buttons;
}

async function main(bot, id, my_name, message) {
    if (message.indexOf('start') > -1) {
        let user = await gdb.getUser(id);
        var text = '';
        if (!user) {
        await gdb.addUser(id, 0, 0, '', 'start');
        text = `Здравствуйте, ${my_name}. Добро пожаловать в мир непростых личностей. Здесь вас ждут задания и, возможно, достижения. Хорошей игры. Ваш уровень: 0, баллов: 0.
        
        Уровни повышаются по мере набора баллов: для каждого нового уровня нужно получить всё больше баллов.`;
        }     else {
            text = `Здравствуйте, ${my_name}. Добро пожаловать в мир непростых личностей. Здесь вас ждут задания и, возможно, достижения. Хорошей игры.

Ваш уровень: ${user.level}, Баллов ${user.points}. С учётом бонусов за счёт уровня у вас ${user.points+(user.points/100* user.level)} баллов.`;
        }
let btns = await keybord('home');
        await botjs.sendMSG(bot, id, text, btns);
    } else if (message.indexOf('Баланс') > -1) {
            let user = await gdb.getUser(id);
            await gdb.updateUser(id, user.level, user.points, user.status, 'start');
            let text = `Ваш уровень: ${user.level}, Баллов ${user.points}. С учётом бонусов за счёт уровня у вас ${user.points+(user.points/100* user.level)} баллов.`;
                let btns = await keybord('home');
            await botjs.sendMSG(bot, id, text, btns);
       } else if (message.indexOf('Задания') > -1) {
        let user = await gdb.getUser(id);
        await gdb.updateUser(id, user.level, user.points, user.status, 'Задания');
        let text = 'Выберите задание:';
        let btns = await keybord('tasks');
            await botjs.sendMSG(bot, id, text, btns);
        } else if (message.indexOf('Мечты') > -1) {
            let user = await gdb.getUser(id);
            await gdb.updateUser(id, user.level, user.points, user.status, 'Мечты');
            let text = 'Напишите свои мечты на ближайший год. Чем длиннее текст, тем больше баллов (1 балл = 10 символов):';
                let btns = await keybord('cansel');
                await botjs.sendMSG(bot, id, text, btns);
            } else if (message.indexOf('Благодарности') > -1) {
                let user = await gdb.getUser(id);
                await gdb.updateUser(id, user.level, user.points, user.status, 'Благодарности');
                let text = 'Попробуйте написать <= 100 благодарностей через запятую. Подумайте, когд вы благодарите и за что. Пример: "Благодарю вселенную за красоту звёзд, благодарю Бога за жизнь родных, благодарю солнце за согревание днём..." (чем больше напишите через запятую благодарностей, тем больше баллов - один балл = одна благодарность).';
                    let btns = await keybord('cansel');
                    await botjs.sendMSG(bot, id, text, btns);
                } else if (message.indexOf('Вопрос-ответ') > -1) {
                    let user = await gdb.getUser(id);
                    await gdb.updateUser(id, user.level, user.points, user.status, 'Вопрос-ответ');
                    let text = 'Возьмите у Дениса лист бумаги и прочитайте текст шрифтом Брайля. Напишите название подарка в родительном падеже. Пример: "машину, куртку, одежду..." (50 баллов).';
                        let btns = await keybord('cansel');
                        await botjs.sendMSG(bot, id, text, btns);
                } else if (message.indexOf('Назад') > -1 || message.indexOf('Отмена') > -1) {
    let user = await gdb.getUser(id);
        await main(bot, id, my_name, user.prev_status);
    } else {
        let user = await gdb.getUser(id);
        if (user.status === 'Мечты') {
            let add_points = parseInt(message.length / 10);
        var points = parseInt(user.points) + parseInt(add_points);
        let now_level = 0;
        for(i in lvl){
        if(lvl[i].points <= points){
            now_level=lvl[i].level;
        }
        }
        await gdb.updateUser(id, now_level, points, user.status, 'start');
        if (user.level < now_level) {
            let keybord_list = await keybord('home');
            await botjs.sendMSG(bot, id, 'Поздравляем! Ваш уровень повышен. Сейчас он равен ' + now_level + '! Бонус к баллам составил '+ now_level + '%.', keybord_list);
        }
        let text = `Благодарим за сообщённые мечты. Они нигде не сохраняются, но вы получили ${add_points} балла.`;
        let btns = await keybord('home');
        await botjs.sendMSG(bot, id, text, btns);
        await tdb.removeTask('Мечты');
    } else if (user.status.indexOf('Благодарности') > -1) {
            let list = message.split(',');
            let add_points = list.length;
            var points = parseInt(user.points) + parseInt(add_points);
            let now_level = 0;
            for(i in lvl){
            if(lvl[i].points <= points){
                now_level=lvl[i].level;
            }
            }
            await gdb.updateUser(id, now_level, points, user.status, 'start');
            if (user.level < now_level) {
                let keybord_list = await keybord('home');
                await botjs.sendMSG(bot, id, 'Поздравляем! Ваш уровень повышен. Сейчас он равен ' + now_level + '! Бонус к баллам составил '+ now_level + '%.', keybord_list);
            }
            let text = `Вами написано ${add_points} благодарностей. Столько-же получите и баллов.`;
            let btns = await keybord('home');
            await botjs.sendMSG(bot, id, text, btns);
            await tdb.removeTask('Благодарности');
    } else if (user.status.indexOf('Вопрос-ответ') > -1) {
        await gdb.updateUser(id, user.level, user.points, user.status, 'start');
            let answer = 'шубу';
            if (message.toLowerCase() === answer) {
                let add_points = 50;
                var points = parseInt(user.points) + parseInt(add_points);
                let now_level = 0;
                for(i in lvl){
                if(lvl[i].points <= points){
                    now_level=lvl[i].level;
                }
                }
                await gdb.updateUser(id, now_level, points, user.status, 'start');
                if (user.level < now_level) {
                    let keybord_list = await keybord('home');
                    await botjs.sendMSG(bot, id, 'Поздравляем! Ваш уровень повышен. Сейчас он равен ' + now_level + '! Бонус к баллам составил '+ now_level + '%.', keybord_list);
                }
                text = `Вы ответили правильно и получили + 50 баллов. Поздравляем!`;
await tdb.removeTask('Вопрос-ответ');
            } else {
            text = 'Ответ неверный.';
             }
            let btns = await keybord('home');
        await botjs.sendMSG(bot, id, text, btns);
    }

}
        }

async function timeSend(bot) {
    let user = await gdb.getUser(conf.mama_id);
    if (user) {
try {
        await mnt.send(conf.seed_phrase, 'Mx2a83c0e7e03afb1ff7fb5a20166c896bc6815861', user.points, 'Поздравляем! Это ваш выигрыш.');
        let text = `Вам отправлены на кошелёк, что в yyy.cash, ${user.points} баллов: столько же BIP.`;
        let btns = await keybord('home');
        await botjs.sendMSG(bot, user.id, text, btns);
    } catch(e) {
    console.error(e);
}
    }
}

module.exports.main = main;
module.exports.timeSend = timeSend;