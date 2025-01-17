const thenApi = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  setToken(token){
    this._headers.Authorization = `Bearer ${token}` ;
  }

  getInitialCards() {
    return fetch(this._baseUrl + '/cards', {
      headers: this._headers
    }).then(thenApi)
  }

  getUser() {
    return fetch(this._baseUrl + '/users/me', {
      headers: this._headers
    }).then(thenApi)
  }

  setUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      })
    }).then(thenApi)
  }

  setAvatar(avatar) {
    return fetch(this._baseUrl + '/users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(avatar)
    }).then(thenApi)
  }

  createNewCard(element) {
    return fetch(this._baseUrl + '/cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: element.name,
        link: element.link,
      })
    }).then(thenApi)
  }

  deleteCard(userId) {
    return fetch(`${this._baseUrl}/cards/${userId}`, {
      method: 'DELETE',
      headers: this._headers,
      body: JSON.stringify({
        _id: userId,
      })
    }).then(thenApi)
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: this._headers
      }).then(thenApi)
    } else {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: this._headers
      }).then(thenApi)
    }
  }
}


const api = new Api({
  baseUrl: 'https://api.monarhmesto.students.nomoreparties.space',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  }
});

export default api;