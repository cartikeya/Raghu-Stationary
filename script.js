// let chatOpen = false;
// let unreadMessages = 0;
// let messages = {}; // Store messages for each seller

// function toggleChat() {
//     const chatBox = document.getElementById("chatBox");
//     chatOpen = !chatOpen;
//     chatBox.classList.toggle("hidden");

//     if (chatOpen) {
//         unreadMessages = 0;
//         document.getElementById("unreadCount").innerText = unreadMessages;
//     }
// }

// // Open chat with a seller
// function openChat(sellerName) {
//     toggleChat();
//     document.getElementById("chatList").innerHTML = `<h4 class="font-bold mb-2">Chat with ${sellerName}</h4>`;

//     // Show previous messages
//     if (messages[sellerName]) {
//         messages[sellerName].forEach(msg => {
//             addMessageToChat(msg, msg.sender === "me");
//         });
//     }
// }

// // Send a message
// function sendMessage() {
//     let messageInput = document.getElementById("chatInput");
//     let message = messageInput.value.trim();
//     if (message === "") return;

//     let chatList = document.getElementById("chatList");
//     addMessageToChat(message, true);

//     let currentChat = document.querySelector("#chatList h4")?.innerText?.replace("Chat with ", "");
//     if (currentChat) {
//         if (!messages[currentChat]) messages[currentChat] = [];
//         messages[currentChat].push({ text: message, sender: "me" });
//     }

//     messageInput.value = "";
// }

// // Simulate receiving a message from a seller (Test function)
// function receiveMessage(sellerName, message) {
//     if (!messages[sellerName]) messages[sellerName] = [];
//     messages[sellerName].push({ text: message, sender: "seller" });

//     if (!chatOpen) {
//         unreadMessages++;
//         document.getElementById("unreadCount").innerText = unreadMessages;
//     }

//     let currentChat = document.querySelector("#chatList h4")?.innerText?.replace("Chat with ", "");
//     if (currentChat === sellerName) {
//         addMessageToChat(message, false);
//     }
// }

// // Add message to chat UI
// function addMessageToChat(message, isMe) {
//     let chatList = document.getElementById("chatList");
//     let messageElement = document.createElement("div");
//     messageElement.className = `p-2 rounded-lg mb-2 ${isMe ? "bg-blue-100 self-end" : "bg-gray-100 self-start"}`;
//     messageElement.innerText = message;
//     chatList.appendChild(messageElement);
//     chatList.scrollTop = chatList.scrollHeight; // Scroll to latest message
// }

// // Simulate receiving messages (Example usage)
// setTimeout(() => receiveMessage("John Doe", "Hey! Is the drafter still available?"), 3000);
// setTimeout(() => receiveMessage("Sarah Smith", "Can you lower the price?"), 5000);