const socket = io('http://localhost:3000');

socket.on('connect', () => {
  socket.on('namespacesList', (data) => {
    const namespacesElement = document.getElementById('namespaces');

    namespacesElement.innerHTML = '';

    for (const namespace of data) {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.innerText = namespace.title;
      li.appendChild(p)
      namespacesElement.appendChild(li);
    }
  })
})
