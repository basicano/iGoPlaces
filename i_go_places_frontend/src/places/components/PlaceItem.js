import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
  // useHttpClient hook to handle HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // authentication context using the useContext hook.
  const auth = useContext(AuthContext);
  
  // initializes necessary states using the useState hook
  const [showMap, setShowMap] = useState(false);            // showMap to manage the visibility of the map modal 
  const [showConfirmModal, setShowConfirmModal] = useState(false);      // showConfirmModal to manage the visibility of the delete confirmation modal

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // confirmDeleteHandler is an async function that handles the deletion of a place. 
  // It sends a DELETE request to the backend server to delete the place and calls the onDelete prop function passed from the parent component.
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +`/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}        // header prop is set to the props.address, which displays the address of the place as the modal header. 
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"          // an onClick handler to close the map modal
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">  
          <Map center={props.coordinates} zoom={16} />    // Map component renders a map with the coordinates provided through the props.coordinates prop.
        </div>
      </Modal>
          // enders the Modal component, which is used to show a map for the place item
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
            // optional <LoadingSpinner> component that is displayed when isLoading is true
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={process.env.REACT_APP_ASSET_URL + `/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
