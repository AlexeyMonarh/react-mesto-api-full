import { React, useEffect, useState } from "react";
import { Route, Switch, Redirect, withRouter, useHistory } from "react-router-dom";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import succed from '../images/vector/succed.svg';
import fail from '../images/vector/fail.svg';
import Main from '../components/Main/Main';
import ImagePopup from '../components/ImagePopup/ImagePopup';
import EditProfilePopup from '../components/EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from '../components/EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from '../components/AddPlacePopup/AddPlacePopup';
import RemoveCardPopup from '../components/RemoveCardPopup/RemoveCardPopup';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import InfoTooltip from '../components/InfoTooltip/InfoTooltip';
import api from '../utils/api';
import * as projectAuth from '../utils/projectAuth';

function App() {
  const history = useHistory();
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);
  const [currentUser, setСurrentUser] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [infoTool, setInfoTool] = useState({
    message: '',
    img: ''
  });
  const [registerPopup, setRegisterPopup] = useState();
  const [savePreload, setSavePreload] = useState('Сохранить')
  const [createPreload, setCreatePreload] = useState('Создать')

  const err = (res) => {
    console.log(`Ошибка: ${res}`);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      projectAuth.getContent(token).then((res) => {
        if (res) {
          setUserData({ email: res.data.email });
          setLoggedIn(true);
          setСurrentUser(res.data);
        }
      })
        .catch((res) => {
          console.log(`Ошибка: ${res}`);
        })
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
      api.getUser().then((res) => {
        setСurrentUser(res.data);
      })
        .catch(err);
      api.getInitialCards().then((res) => {
        setCards(res);
      })
        .catch(err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  });

  function handleRegister(data) {
    const { email, password } = data;
    projectAuth.register(email, password).then((res) => {
      if (res) {
        history.push('/signin');
        setRegisterPopup(true);
        setInfoTool({
          message: 'Вы успешно зарегистрировались!',
          img: succed
        })
      }
    })
      .catch((err) => {
        setRegisterPopup(true);
        setInfoTool({
          message: 'Что-то пошло не так! Попробуйте ещё раз.',
          img: fail
        })
        console.log(`Такой email существует ${err}`)
      })
  }

  function handleLogin(data) {
    const { email, password } = data;
    setUserData({ email: email });
    projectAuth.authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token)
          api.setToken(res.token);
          return res.token;
        }
      })
      .then((token) => {
        projectAuth.getContent(token).then((res) => {
          if (res) {
            setUserData({ email: res.data.email });
            setLoggedIn(true);
            setСurrentUser(res.data);
            history.push('/');
          }
        })
          .catch(err)
      })

      .catch(err)
  }

  function signOut() {
    localStorage.removeItem('jwt')
    setLoggedIn(false)
    history.push('/signin')
  }

  function handleAddPlaceSubmit(data) {
    setCreatePreload('Создание...')
    api.createNewCard(data).then((res) => {
      setCards([res.data, ...cards]);
      closeAllPopups();
    })
      .catch(err)
      .finally(() => {
        setCreatePreload('Создать');
        closeAllPopups();
      }
      )
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard.data : c);
      setCards(newCards);
    })
      .catch(err)
  }

  function handleCardDelete(cardId) {
    return api.deleteCard(cardId).then(() => {
      const newList = cards.filter((c) => c._id !== cardId);
      setCards(newList);
    })
      .then(closeAllPopups())
      .catch(err)
  }

  function handleUpdateAvatar(avatar) {
    setSavePreload('Сохранение...')
    api.setAvatar(avatar)
      .then((res) => {
        setСurrentUser(res);
      })
      .catch(err)
      .finally(() => {
        setSavePreload('Сохранить');
        closeAllPopups();
      }
      )
  }

  function handleUpdateUser(data) {
    setSavePreload('Сохранение...')
    api.setUserInfo(data)
      .then((res) => {
        setСurrentUser(res);
        closeAllPopups();
      })
      .catch(err)
      .finally(() => {
        setSavePreload('Сохранить');
        closeAllPopups();
      }
      )
  }

  function handleDeleteCardClick() {
    setIsDeletePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick(props) {
    setSelectedCard({ link: props.link, name: props.name });
  }

  function closeAllPopups() {
    setIsDeletePopupOpen(false)
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setRegisterPopup(false);
  }

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      closeAllPopups();
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">

        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            email={userData.email}
            signOut={signOut}
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onPopupDelete={handleDeleteCardClick}
            setId={setCurrentId}
          />
          <Route path="/signin">
            <Login
              handleLogin={handleLogin}
            />
          </Route>
          <Route path="/signup">
            <Register
              onRegister={handleRegister}
            />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          savePreload={savePreload}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          savePreload={savePreload}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onCreateCard={handleAddPlaceSubmit}
          createPreload={createPreload}
        />

        <RemoveCardPopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          currentId={currentId}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={registerPopup}
          onClose={closeAllPopups}
          infoTool={infoTool}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);