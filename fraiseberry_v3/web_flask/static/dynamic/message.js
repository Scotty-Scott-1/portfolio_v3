document.addEventListener("DOMContentLoaded", function() {


	const dms = document.querySelectorAll(".dm");
	const varThisUserID = document.getElementById("varThisUserID").textContent;
	const varMatchID = document.getElementById("varMatchID").textContent;
	const send_icons = document.getElementById("send_icon");
	const text_area = document.getElementById("text_area");
	const home = document.getElementById("home");
	const refreshTime = 2 * 60 * 1000;

	// Adds a class to add styles //
	dms.forEach(dm => {
		const senderID = dm.querySelector("#senderID");
		if (senderID.textContent == varThisUserID) {
			dm.classList.add('position_this_user')
		}
		if (senderID.textContent == varMatchID) {
			dm.classList.add('position_other_user')
		}
	});

	const socket = io(); // Connect to the server

	socket.emit("join", {
		match_id: varMatchID
	});
	console.log("joins");

	send_icons.addEventListener('click', () => {
		const message = text_area.value
		console.log(message)
		console.log("clicked");
		console.log(varThisUserID);
		console.log(varMatchID);

		if (message.trim()) {  // Send only messages with non-empty content
			socket.emit('message',
			{
				message: message,
				sender_id: varThisUserID,
				receiver_id: varMatchID,
			});
			text_area.value = ''; // Clear input field after sending
		}
	});

	socket.on('message', (message) => {
		console.log(message)

		const message_content = message["message"];
		const message_sender = message["sender_id"];
		const message_reciever = message["receiver_id"];

		console.log(message_content)
		console.log(message_sender)
		console.log(message_reciever)

		const dm = document.createElement('div');
		dm.classList.add('dm');

		const textElement = document.createElement('p');
		textElement.classList.add('text');
		textElement.textContent = message_content

		const datetimeElement = document.createElement('p');
		datetimeElement.classList.add('datetime');

		const now = new Date();
		const hours = now.getHours();
		const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure two-digit format

		const currentTime = `${hours}:${minutes}`;

		console.log('Current time:', currentTime);
		datetimeElement.textContent = currentTime;


		const hiddenElement = document.createElement('p');
		hiddenElement.classList.add('hidden');  // Add class for styling
		hiddenElement.textContent = message_sender;
		hiddenElement.id = "senderID"
		if (hiddenElement.textContent == varThisUserID)
			{
				dm.classList.add('position_this_user')
			}
		if (hiddenElement.textContent == varMatchID)
			{
				dm.classList.add("position_other_user")
			}

		// Append child elements to the main div
		if (dm) {
			dm.appendChild(textElement);
			dm.appendChild(datetimeElement);
			dm.appendChild(hiddenElement);
		}


		const messageContainer = document.getElementById('message_container');
		if (messageContainer) {
			messageContainer.appendChild(dm);
		}



	});


	home.addEventListener("click", () =>
		{
			window.location.href = '/dashboard/';
		}
	)


});

