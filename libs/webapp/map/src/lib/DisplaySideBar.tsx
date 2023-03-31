import { useState } from 'react';
import './DisplaySideBar.css';
import DisplayRestaurants from './components/DisplayRestaurants';
import DisplayFriends from './components/DisplayFriends';

/* eslint-disable-next-line */
export interface DisplaySideBarProps {}

export function DisplaySideBar(props: DisplaySideBarProps) {
  const [showingContent, setShowingContent] = useState('restaurant');

  return (
    <div>
      <div className="side-bar-header">
        <div className="sideBarTitle">Show me: </div>
        <select
          id="showingDropdown"
          className="dropdown"
          value={showingContent}
          onChange={(e) => setShowingContent(e.target.value)}
        >
          <option value="course">Courses</option>
          <option value="restaurant">Restaurants</option>
          <option value="friend">Friends</option>
        </select>
      </div>
      <div className="side-bar-body">
        {showingContent === 'restaurant' ? (
          <DisplayRestaurants />
        ) : showingContent === 'course' ? (
          <div>Course</div>
        ) : (
          <DisplayFriends />
        )}
      </div>
    </div>
  );
}

export default DisplaySideBar;
