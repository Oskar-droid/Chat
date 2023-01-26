// Get username
const inputLoginUsername = document.getElementById('login-form-username');

inputLoginUsername.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' && inputLoginUsername.value.trim()) {
		window.chatUserName = inputLoginUsername.value;
		joinRoom(inputLoginUsername.value);
		document.getElementById('login-form').style.display = 'none';
	}
});

// Send message
const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
	//Text value reading
	let msg = document.getElementById('text').value;
	return
	if (msg !== '') {
		console.log(msg);
		
		const chatContainer = document.querySelector('.chat_sides')
		const message = `
        <div id="chat_child_container">
            <div id="box" class="box">
                <div id="box_child">
                    <img src="img/profile.png" alt="profile_image">
                    <p>${msg}</p>
                </div>
            </div>
        </div>
        `;
		
		chatContainer.insertAdjacentHTML('beforeend', message);
		msg = ' ';
	} else {
		console.log('empty!');
	}
});


