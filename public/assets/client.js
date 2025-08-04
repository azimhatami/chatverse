const socket = io('http://localhost:3000');
let namespaceSocket;

function stringToHTML(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body.firstChild
}

function initNamespaceConnection(endpoint) {
  if(namespaceSocket) namespaceSocket.close();
  namespaceSocket = io(`http://localhost:3000/${endpoint}`);
  namespaceSocket.on('connect', () => {
    namespaceSocket.on('roomList', rooms => {
      // console.log(rooms);
      getRoomInfo(rooms[0]?.name)
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
          getRoomInfo(roomName)
        })
      }
    })
  })
}

function getRoomInfo(roomName) {
  namespaceSocket.emit('joinRoom', roomName)
  namespaceSocket.once('roomInfo', roomInfo => {
    console.log(roomInfo);
    document.querySelector('#roomName h3').innerText = roomInfo.description;
  })

  namespaceSocket.on('onlineUsers', users => {
    document.getElementById('count').innerText = users;
  })
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
})
