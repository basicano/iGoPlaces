import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';

// UsersList component that represents a list of users. It receives the user data as props.
const UsersList = props => {
  // checks if the items prop (an array of users) is empty.
  if (props.items.length === 0) {
    return (
      <div className="center">
      // renders a <div> with the class name "center" to center the content and a Card
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  // For each user, we render a UserItem component. 
  // We pass the user's id, image, name, and the count of places they have (user.places.length) as props to the UserItem component. 
  // Each UserItem component is assigned a unique key prop using the user.id value.
  
  return (
    // renders an unordered list (<ul>) with the class name "users-list"
    <ul className="users-list">
      { // the map method to iterate over each user in the props.items array
        props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
