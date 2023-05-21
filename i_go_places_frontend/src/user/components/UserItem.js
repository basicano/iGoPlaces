import React from 'react';

// this wraps and renders an anchor tag but it also adds this extra block the navigation logic.
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar.js';
import Card from '../../shared/components/UIElements/Card.js';
import './UserItem.css';

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        {/** react-router-dom can step in before a navigation happens,
         *  before a page reload happens and block that default action
         *  from happening and instead have a look at our configured 
         * routes here and load the appropriate React component */}
        <Link to={`/${props.id}/places`}> {/** where to for each user is diff */}
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;