// This is the front end js file
const chatForm = document.getElementById('btn');
const chatMessages = document.querySelector('.chat_sides');
const userList = document.getElementById('users_box_inner');
const uploadBtn = document.getElementById('upload_btn');

//We now have access to the front end socket here
const socket = io();

//Send username to the server
function joinRoom(username, room = 'test_room') {
	socket.emit('joinRoom', { username, room });
}

//Get room and users
socket.on('roomUsers', ({ users }) => {
	outputUsers(users);
});

// Catch the message here
socket.on('message', message => {
	console.log(message);

	outputMessage(message);

	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Catch the old messages here
socket.on('old_messages', messages => {
	console.log(messages);

	outputOldMessages(messages);

	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submit the form
chatForm.addEventListener('click', (e) => {
	e.preventDefault();

	let msg = document.getElementById('text');
	//Emit message to the server
	socket.emit('chatMessage', msg.value);

	msg.value = '';
	msg.focus();
});

function upload(files) {
	console.error('_____files', files);
	this.value = '';
	socket.emit("upload", { file: files[0], fileName: files[0].name }, (status) => {
		console.log(status);
		this.value = '';
	});
}

//Submit the form
// uploadBtn.addEventListener('change', (e) => {
// 	e.preventDefault();
// console.error('_____e.files', e.files);
// 	socket.emit("upload", e.files[0], (status) => {
// 		console.log(status);
// 	});
// });

// Output message to DOM
function outputMessage(message) {
	const div = document.createElement('div');

	div.classList.add('chat_child_container');
	const messageTpl = `
		<div class="box">
			<div class="box_child">
				<p class="msg-username"><b>${message.username}</b> <span>${message.time}</span></p>
				<p>${message.textMessage}</p>
			</div>
		</div>
	`;
	div.innerHTML = messageTpl;

	document.querySelector('.chat_sides').appendChild(div);
}

function outputOldMessages(messages) {
	if (!messages || !messages.length) return;

	const allMessagesTpl = [];

	messages.forEach(({ user, message }) => {
		const div = document.createElement('div');

		div.classList.add('chat_child_container');
		const messageTpl = `
		<div class="box">
			<div class="box_child">
				<p class="msg-username"><b>${user.username}</b> <span>${message.time}</span></p>
				<p>${message.textMessage}</p>
			</div>
		</div>
	`;
		div.innerHTML = messageTpl;
		document.querySelector('.chat_sides').appendChild(div);
	});
}

function outputUsers(users) {
	userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
