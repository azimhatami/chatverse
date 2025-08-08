const socket = io('http://localhost:3000');
let namespaceSocket;

function stringToHTML(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body.firstChild
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function initNamespaceConnection(endpoint) {
  if(namespaceSocket) namespaceSocket.close();
  namespaceSocket = io(`http://localhost:3000/${endpoint}`);
  namespaceSocket.on('connect', () => {
    namespaceSocket.on('roomList', rooms => {
      // console.log(rooms);
      getRoomInfo(rooms[0]?.name, endpoint)
      const roomsElement = document.querySelector('#contacts ul')
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
          getRoomInfo(roomName, endpoint)
        })
      }
    })
  })
}

function getRoomInfo(roomName, endpoint) {
  namespaceSocket.emit('joinRoom', roomName)
    document.querySelector('#roomName h3').setAttribute('roomName', roomName)
    document.querySelector('#roomName h3').setAttribute('endpoint', endpoint)
  namespaceSocket.once('roomInfo', roomInfo => {
    console.log(roomInfo);
    document.querySelector('#roomName h3').innerText = roomInfo.description;
  })

  namespaceSocket.on('onlineUsers', users => {
    document.getElementById('count').innerText = users;
  })
}

function sendMessage() {
  const roomName = document.querySelector('#roomName h3').getAttribute('roomName')
  const endpoint = document.querySelector('#roomName h3').getAttribute('endpoint')
  let message = document.querySelector('.message-input input#messageInput').value;

  if (message.trim() == '') {
    return alert('input message can not be empty');
  }
  const userId = document.getElementById('userID').value;
  console.log('USERID: ', userId);
  namespaceSocket.emit('newMessage', {
    sender: userId,
    message,
    roomName,
    endpoint
  });
  namespaceSocket.on('confirmMessage', data => {
    console.log(data);
  })

  const li = stringToHTML(`
    <li class="sent">
        <img src="http://emilcarlsson.se/assets/harveyspecter.png"
            alt="" />
        <p>${message}</p>
    </li>
  `)

  document.querySelector('.messages ul').appendChild(li);
  document.querySelector('.message-input input#messageInput').value = '';

  const messagesElement = document.querySelector('div.messages');
  messagesElement.scrollTo(0, messagesElement.scrollHeight);
}

socket.on('connect', () => {
  socket.on('namespacesList', (data) => {
    const namespacesElement = document.getElementById('namespaces');
    namespacesElement.innerHTML = '';

    initNamespaceConnection(data[0].endpoint)

    for (const namespace of data) {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.setAttribute('class', 'namespaceTitle')
      p.setAttribute('endpoint', namespace.endpoint)
      p.innerText = namespace.title;
      li.appendChild(p)
      namespacesElement.appendChild(li);
    }
    const namespaceNodes = document.querySelectorAll('#namespaces li p.namespaceTitle');
    // console.log(namespaceNodes);
    for (const namespace of namespaceNodes) {
      namespace.addEventListener('click', () => {
        const endpoint = namespace.getAttribute('endpoint');
        initNamespaceConnection(endpoint)
      });
    }
  })
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Enter'){
      sendMessage();
    }
  })

  document.querySelector('button.submit').addEventListener('click', () => {
    sendMessage()
  })
})

