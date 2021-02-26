import React from 'react';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

function Card({ data, onPopupDelete, setId, onCardLike, onCardClick }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = data.owner === currentUser._id;
  const cardDeleteButtonClassName = (
    `elements__element-delete-button ${isOwn ? 'elements__element-delete-button_visible' : 'elements__element-delete-button_hidden'}`
  );
  const isLiked = data.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = `elements__element-like ${isLiked ? 'elements__element-like_visible' : 'elements__element-like_hidden'}`;

  function setCardId() {
    onPopupDelete();
    setId(data._id);
  }

  function handleLikeClick() {
    onCardLike(data);
  }

  function handleClick() {
    onCardClick(data);
  }

  return (
    <li className="elements__element">
      <button type="submit" className={cardDeleteButtonClassName} onClick={setCardId}></button>
      <img src={data.link} id="" alt="Места-России" className="elements__element-img" onClick={handleClick} />
      <div className="elements__element-description">
        <h2 className="elements__element-title">{data.name}</h2>
        <div className="elements__element-like-box">
          <button type="submit" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <div className="elements__element-likes">{data.likes.length}</div>
        </div>
      </div>
    </li>
  )
}

export default Card;