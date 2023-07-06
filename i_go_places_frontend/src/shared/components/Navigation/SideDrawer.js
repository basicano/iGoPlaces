import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';


import './SideDrawer.css';
// represents a side drawer that slides in from the left
const SideDrawer = props => {
    // represents the content of the side drawer and is wrapped in a CSSTransition component.
    const content = (
        <CSSTransition
          in={props.show}
          timeout={200}
          classNames="slide-in-left"
          mountOnEnter
          unmountOnExit>
          <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>  //The content that should be rendered inside the side drawer.
        </CSSTransition>
      );

    // only render if component when side drawer is clled
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
