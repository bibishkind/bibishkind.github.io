class API {
  constructor (token) {
    this.token = token
  }

  async GetMessages () {
    const resp = await fetch('http://localhost:8080/api/messages', {
      headers: {
        Authorization: 'Basic ' + this.token
      }
    })
    if (resp.status === 200) {
      return await resp.json()
    } else {
      const json = await resp.json()
      throw new Error(json.error)
    }
  }

  async CreateMessage(message) {
    const resp = await fetch('http://localhost:8080/api/messages', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + this.token
      },
      body: JSON.stringify(message)
    })
    if (resp.status === 201) {
      const json = await resp.json()
      return json.id
    } else {
      const json = await resp.json()
      throw new Error(json.error)
    }
  }

  async SearchUser (username) {
    const resp = await fetch(`http://localhost:8080/api/users/search?username=${username}`)
    if (resp.status === 200) {
      return await resp.json()
    } else {
      const json = await resp.json()
      throw new Error(json.error)
    }
  }

  async GetUser(userId) {
    const resp = await fetch(`http://localhost:8080/api/users/${userId}`, {
    })
    if (resp.status === 200) {
      return await resp.json()
    } else {
      const json = await resp.json()
      throw new Error(json.error)
    }
  }
}

async function LoadUsers(messages) {
  const userUl = document.getElementById('user-ul')
  const menuUserUl = document.getElementById('menu-user-ul')
  let first = true
  for (let userId in messages) {
    const user = await api.GetUser(userId)
    const userLi = document.createElement('li')
    const menuUserLi = document.createElement('li')
    userLi.classList.add('user-li')
    userLi.id = user.id
    menuUserLi.classList.add('menu-user-li')
    menuUserLi.id = user.id
    userLi.innerText = user.username
    menuUserLi.innerText = user.username
    if (first) {
      userLi.classList.add('user-li-selected')
      menuUserLi.classList.add('menu-user-li-selected')
      first = false
    }
    userLi.onclick = (e) => {
      const userUl = document.getElementById('user-ul')
      for (let userLi of userUl.childNodes) {
        userLi.classList.forEach(value => {
          if (value === 'user-li-selected') {
            userLi.classList.remove('user-li-selected')
          }
        })
        if (userLi.id === e.target.id) {
          userLi.classList.add('user-li-selected')
        }
      }
      LoadMessages()
    }
    menuUserLi.onclick = (e) => {
      const userUl = document.getElementById('user-ul')
      for (let userLi of userUl.childNodes) {
        userLi.classList.forEach(value => {
          if (value === 'user-li-selected') {
            userLi.classList.remove('user-li-selected')
          }
        })
        if (userLi.id === e.target.id) {
          userLi.classList.add('user-li-selected')
        }
      }
      const menuUserUl = document.getElementById('menu-user-ul')
      for (let userLi of menuUserUl.childNodes) {
        userLi.classList.forEach(value => {
          if (value === 'menu-user-li-selected') {
            userLi.classList.remove('menu-user-li-selected')
          }
        })
        if (userLi.id === e.target.id) {
          userLi.classList.add('menu-user-li-selected')
        }
      }
      LoadMessages()
    }
    userUl.appendChild(userLi)
    menuUserUl.appendChild(menuUserLi)
  }
}

async function LoadUsername() {
  const userId = 82
  const user = await api.GetUser(userId)
  const username = document.getElementById('username')
  const menuUsername = document.getElementById('menu-username')
  username.innerText = user.username
  menuUsername.innerText = user.username
}

async function LoadMessages() {
  const messages = await api.GetMessages()
  const userUl = document.getElementById('user-ul')
  let userId = -1
  for (let userLi of userUl.childNodes) {
    userLi.classList.forEach((value) => {
      if (value === 'user-li-selected') {
        userId = userLi.id
      }
    })
  }
  const messageContainer = document.getElementById('message-container')
  messageContainer.innerHTML = ''
  if (userId !== -1) {
    messages[userId].forEach(value => {
      const div = document.createElement('div')
      div.classList.add('message')
      if (value.fromId === 82) {
        div.classList.add('my-message')
      }
      const p = document.createElement('p')
      p.innerText = value.text
      div.appendChild(p)
      messageContainer.appendChild(div)
    })
  }
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

const api = new API(localStorage.getItem('token'))

window.onload = async () => {
  const messages = await api.GetMessages()
  await LoadUsername()
  await LoadUsers(messages)
  await LoadMessages()
}

async function SearchUser() {
  const input = document.getElementById('search-input')
  const ul = document.getElementById('search-user-ul')
  const username = input.value
  if (username.replaceAll(' ', '') === '') {
    ul.style.display = 'none'
    return null
  }
  ul.style.display = 'block'
  ul.innerHTML = ''
  const users = await api.SearchUser(username)
  users.forEach(user => {
    const li = document.createElement('li')
    li.id = user.id
    li.classList.add('user-li')
    li.innerText = user.username
    ul.appendChild(li)
    li.onclick = (e) => {
      const userUl = document.getElementById('user-ul')
      const menuUserUl = document.getElementById('menu-user-ul')
      let userLi = li.cloneNode(true)
      let menuUserLi = li.cloneNode(true)
      Object.assign(userLi, li)
      Object.assign(menuUserUl, li)
      userLi.onclick = (e) => {
        const userUl = document.getElementById('user-ul')
        for (let userLi of userUl.childNodes) {
          userLi.classList.forEach(value => {
            if (value === 'user-li-selected') {
              userLi.classList.remove('user-li-selected')
            }
          })
          if (userLi.id === e.target.id) {
            userLi.classList.add('user-li-selected')
          }
        }
        LoadMessages()
      }
      menuUserLi.onclick = (e) => {
        const userUl = document.getElementById('user-ul')
        for (let userLi of userUl.childNodes) {
          userLi.classList.forEach(value => {
            if (value === 'user-li-selected') {
              userLi.classList.remove('user-li-selected')
            }
          })
          if (userLi.id === e.target.id) {
            userLi.classList.add('user-li-selected')
          }
        }
        const menuUserUl = document.getElementById('menu-user-ul')
        for (let userLi of menuUserUl.childNodes) {
          userLi.classList.forEach(value => {
            if (value === 'menu-user-li-selected') {
              userLi.classList.remove('menu-user-li-selected')
            }
          })
          if (userLi.id === e.target.id) {
            userLi.classList.add('menu-user-li-selected')
          }
        }
        LoadMessages()
      }
      userUl.appendChild(userLi)
      menuUserLi.classList.remove('user-li')
      menuUserLi.classList.add('menu-user-li')
      menuUserUl.appendChild(menuUserLi)
    }
  })
}

async function SendMessage() {
  const input = document.getElementById('message-input')
  const messageContainer = document.getElementById('message-container')
  const text = input.value
  input.value = ''
  if (text.replaceAll(' ', '') === '') {
    return null
  }
  const div = document.createElement('div')
  div.classList.add('message', 'my-message')
  const p = document.createElement('p')
  p.innerText = text
  let userId = -1
  const userUl = document.getElementById('user-ul')
  for (let userLi of userUl.childNodes) {
    userLi.classList.forEach((value) => {
      if (value === 'user-li-selected') {
        userId = userLi.id
      }
    })
  }
  const id = await api.CreateMessage({fromId: 82, toId: Number(userId), text: text})
  div.appendChild(p)
  messageContainer.appendChild(div)
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

function DisplayMenu() {
  const menu = document.getElementById('menu')
  console.log(menu.style.display)
  menu.style.display = menu.style.display === '' ? 'block' : ''
}