// necessary modules and components from the react and react-router-dom libraries
import React from 'react';

// this wraps and renders an anchor tag but it also adds this extra block the navigation logic.
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar.js';
import Card from '../../shared/components/UIElements/Card.js';
import './UserItem.css';

// represents an item for displaying user information. It receives the user data as props.
const UserItem = props => {
  return (
    // component renders a list item (<li>) with the class name "user-item"
    <li className="user-item">
    // a Card component from our custom components that provides a styled container for the user information.
      <Card className="user-item__content">
        {/** react-router-dom can step in before a navigation happens,
         *  before a page reload happens and block that default action
         *  from happening and instead have a look at our configured 
         * routes here and load the appropriate React component */}

        // use the Link component from react-router-dom to create a navigation link.
        <Link to={`/${props.id}/places`}> {/** where to for each user is diff */}    // to prop specifies the destination URL, which includes the user ID and the path /places. This link will navigate to a specific user's places page when clicked.
          <div className="user-item__image">
  //  user's name (props.name) rendered as an <h2> element and the number of places the user has (props.placeCount).
            <Avatar image={process.env.REACT_APP_ASSET_URL +`/${props.image}`} alt={props.name} />
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
