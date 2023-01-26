const moment = require('moment');
const { Messages } = require('../database');

const messages = [];

//Save all messages in array
function saveMessageToDb(user, message) {
	const fullMessage = { user, message };
	messages.push(fullMessage);

	const messageDb = new Messages(fullMessage);
	messageDb.save(function (err) {
		if (err) {
			console.error('_____save error', err);
		} else {
			console.log('_____save to db');
		}
	});

	return user;
}

function formatMessage(username, textMessage) {
	return {
		username: username,
		textMessage: textMessage,
		time: moment().format('h:mm a'),
	}
}

module.exports = {
	formatMessage,
	saveMessageToDb,
	messages,
};
