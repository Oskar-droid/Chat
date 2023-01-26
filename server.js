const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ip = require("ip");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	maxHttpBufferSize: 1e9 // 1000 MB
});
const PORT = 3333 || process.env.PORT;

app.use(express.static("public"));

const { format } = require('path');
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users');
const { saveMessageToDb, formatMessage, messages } = require('./utils/messages');
const { Messages } = require('./database');

const uploadFolder = './public/tmp/uploads';

// Create upload folder if not exist
if (!fs.existsSync(uploadFolder)){
	fs.mkdirSync(uploadFolder, { recursive: true });

	console.log('Folder Created Successfully.');
}

const admin = 'admin';

// Run when a client connects
io.on('connection',  (socket) => {

	// User joined to the room
	socket.on('joinRoom', async ({ username, room }) => {
		//to join a room
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		const allMessagesFromDb = await Messages.find({});

		socket.emit('old_messages', allMessagesFromDb);
		//socket.emit('message', formatMessage(admin, `${user.username} has joined`));

		socket.broadcast.to(user.room).emit('message', formatMessage(admin, `${user.username} has joined the chat!`));

		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});


	// Listen for the chat message
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);

		if (!user) return;

		io.to(user.room).emit('message', formatMessage(user.username, msg));
		saveMessageToDb(user, formatMessage(user.username, msg))
	});

	// User disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit('message', formatMessage(admin, `${user.username} has left the chat`));

			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});

	// User upload files
	socket.on("upload", ({file, fileName}, callback) => {
		console.log(file); // <Buffer 25 50 44 ...>

		if (!fs.existsSync(uploadFolder)){
			fs.mkdirSync(uploadFolder, { recursive: true });
		}

		const timestamp = Math.floor(Date.now() / 1000);

		// save the content to the disk, for example
		fs.writeFile(`${uploadFolder}/${timestamp}-${fileName}`, file, (err) => {
			callback({ message: err ? err : "success" });

			const user = getCurrentUser(socket.id);
			const messageTo = formatMessage(user.username, `<a href="/tmp/uploads/${timestamp}-${fileName}" download>${fileName}</a>`);
			io.to(user.room).emit('message', messageTo);
			saveMessageToDb(user, messageTo)
		});
	});
});

server.listen(PORT, ip.address(), () => {
	console.log(`Server running on: ${ip.address()}:${PORT}`);
});

