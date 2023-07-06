import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

// receives props as an argument, which contains an array of items representing the places to be displayed. 
const PlaceList = props => {
  if (props.items.length === 0) {
    // If the items array is empty, it returns a JSX block that displays a message along with a card and a button. 
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  // component renders an unordered list (<ul>) with the class name "place-list"
  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}  // onDelete prop is a function that is called when the delete button is clicked in the PlaceItem component
        />
      ))}
    </ul>
  );
};

export default PlaceList;
