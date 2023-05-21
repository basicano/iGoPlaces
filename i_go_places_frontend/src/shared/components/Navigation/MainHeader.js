import React from 'react';

import './MainHeader.css';

const MainHeader = props => {
  return <header className="main-header">
    {/** props.childred contains all the 
     * div etc inside the <MainHeader> <div></div></MainHeader> tags */}
      {props.children}
    </header>;
};

export default MainHeader;
