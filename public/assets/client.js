const socket = io('http://localhost:3000');
let namespaceSocket;

function stringToHTML(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body.firstChild;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setupEventListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      sendMessage();
    }
  });

  document.querySelector('button.submit').addEventListener('click', () => {
    sendMessage();
  });
}

function initNamespaceConnection(endpoint) {
  if (namespaceSocket) {
    namespaceSocket.close();
  }
  namespaceSocket = io(`http://localhost:3000/${endpoint}`);

  namespaceSocket.on('connect', () => {
    namespaceSocket.on('roomList', rooms => {
      getRoomInfo(rooms[0]?.name, endpoint);
      const roomsElement = document.querySelector('#contacts ul');
      roomsElement.innerHTML = '';
      for (const room of rooms) {
        const html = stringToHTML(`
          <li class="contact" roomName="${room.name}">
            <div class="wrap">
              <img src="${room.image}" height="40"/>
              <div class="meta">
                <p class="name">${room.name}</p>
                <p class="preview">${room.description}</p>
              </div>
            </div>
          </li>
        `);
        roomsElement.appendChild(html);
      }

      const roomNodes = document.querySelectorAll('ul li.contact');
      for (const room of roomNodes) {
        room.addEventListener('click', () => {
          const roomName = room.getAttribute('roomName');
          getRoomInfo(roomName, endpoint);
        });
      }
    });

    namespaceSocket.off('newMessageToClients'); 
    namespaceSocket.on('newMessageToClients', data => {
      const userId = document.getElementById('userID').value;
      if (data.sender !== userId) {
        const li = stringToHTML(`
            <li class="replies">
              <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
              <p>${data.message}</p>
            </li>
          `);
        document.querySelector('.messages ul').appendChild(li);
        const messagesElement = document.querySelector('div.messages');
        messagesElement.scrollTo(0, messagesElement.scrollHeight);
      }
    });
  });
}

function getRoomInfo(roomName, endpoint) {
  namespaceSocket.emit('joinRoom', roomName);
  document.querySelector('#roomName h3').setAttribute('roomName', roomName);
  document.querySelector('#roomName h3').setAttribute('endpoint', endpoint);

  namespaceSocket.once('roomInfo', roomInfo => {
    document.querySelector('.messages ul').innerHTML = '';
    document.querySelector('#roomName h3').innerText = roomInfo.description;
    const messages = roomInfo.messages;
    const userId = document.getElementById('userID').value;
    for (const message of messages) {
      const li = stringToHTML(`
        <li class="${(userId == message.sender) ? 'sent' : 'replies'}">
          <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
          <p>${message.message}</p>
        </li>
      `);
      document.querySelector('.messages ul').appendChild(li);
    }
    const messagesElement = document.querySelector('div.messages');
    messagesElement.scrollTo(0, messagesElement.scrollHeight);
  });

  namespaceSocket.on('onlineUsers', users => {
    document.getElementById('count').innerText = users;
  });
}


function sendMessage() {
  const roomName = document.querySelector('#roomName h3').getAttribute('roomName');
  const endpoint = document.querySelector('#roomName h3').getAttribute('endpoint');
  const messageInput = document.querySelector('.message-input input#messageInput');
  let message = messageInput.value;

  if (message.trim() === '') {
    return;
  }
  const userId = document.getElementById('userID').value;
  
  namespaceSocket.emit('newMessage', {
    sender: userId,
    message,
    roomName,
    endpoint
  });

  const li = stringToHTML(`
    <li class="sent">
        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
        <p>${message}</p>
    </li>
  `);
  document.querySelector('.messages ul').appendChild(li);

  messageInput.value = '';
  const messagesElement = document.querySelector('div.messages');
  messagesElement.scrollTo(0, messagesElement.scrollHeight);
}

socket.on('connect', () => {
  socket.on('namespacesList', (data) => {
    const namespacesElement = document.getElementById('namespaces');
    namespacesElement.innerHTML = '';
    
    if (data.length > 0) {
      initNamespaceConnection(data[0].endpoint);
    }
    
    for (const namespace of data) {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.setAttribute('class', 'namespaceTitle');
      p.setAttribute('endpoint', namespace.endpoint);
      p.innerText = namespace.title;
      li.appendChild(p);
      namespacesElement.appendChild(li);
    }

    const namespaceNodes = document.querySelectorAll('#namespaces li p.namespaceTitle');
    for (const namespace of namespaceNodes) {
      namespace.addEventListener('click', () => {
        const endpoint = namespace.getAttribute('endpoint');
        initNamespaceConnection(endpoint);
      });
    }
  });
  
  setupEventListeners();
});
