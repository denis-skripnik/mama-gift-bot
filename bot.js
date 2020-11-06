async function keybord(bot, btn_list) {
    let replyMarkup = bot.keyboard([
            btn_list,
    ], {resize: true});
    var buttons = {
        parseMode: 'Html',
        replyMarkup};
        return buttons;
    }

async function sendMSG(bot, userId, text, buttons) {
        let options = await keybord(bot, buttons);
        await bot.sendMessage(userId, text, options);
}

module.exports.sendMSG = sendMSG;