import { useState } from 'react';
import './DisplaySideBar.css';
import DisplayRestaurants from './components/DisplayRestaurants';
import DisplayFriends from './components/DisplayFriends';
import DisplayCourses from './components/DisplayCourses';
import { useTheme } from '@mui/material/styles';

export interface DisplaySideBarProps {
  changeMapFocus: (
    location: string,
    latitute?: string,
    longitude?: string
  ) => void;
}

export function DisplaySideBar(props: DisplaySideBarProps) {
  const [showingContent, setShowingContent] = useState('course');
  const theme = useTheme();

  return (
    <div>
      <div className="side-bar-header" style={{borderBottomColor: theme.palette.secondary.main}}>
        <div className="sideBarTitle" style={{color: theme.palette.secondary.main}}>Show me: </div>
        <select
          id="showingDropdown"
          className="dropdown"
          style={{ backgroundColor: theme.palette.secondary.main }}
          value={showingContent}
          onChange={(e) => setShowingContent(e.target.value)}
        >
          <option value="course">Courses</option>
          <option value="friend">Friends</option>
          <option value="restaurant">Restaurants</option>
        </select>
      </div>
      <div className="side-bar-body" style={{color: theme.palette.secondary.main}}>
        {showingContent === 'restaurant' ? (
          <DisplayRestaurants changeMapFocus={props.changeMapFocus} />
        ) : showingContent === 'course' ? (
          <DisplayCourses changeMapFocus={props.changeMapFocus} />
        ) : (
          <DisplayFriends changeMapFocus={props.changeMapFocus} />
        )}
      </div>
    </div>
  );
}

export default DisplaySideBar;
