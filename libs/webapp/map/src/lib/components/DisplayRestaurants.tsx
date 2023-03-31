import './components.css';
import { List, ListItem } from '@mui/material';
import { restaurantList } from '../assets/Restaurants';

export interface DisplayRestaurantsProps {
  changeMapFocus: (
    location: string,
    latitute?: string,
    longitude?: string
  ) => void;
}

export function DisplayRestaurants(props: DisplayRestaurantsProps) {
  const restaurants = restaurantList.map((restaurant) => (
    <ListItem
      key={restaurant.name}
      className="panel"
      onClick={() => props.changeMapFocus(restaurant.name)}
    >
      <div id={'id' + restaurant.name} className="logoDiv">
        <img src={restaurant.logo} alt="logo" className="logo" />
      </div>

      <div className="info">{restaurant.name}</div>
    </ListItem>
  ));

  return (
    <div>
      <List>{restaurants}</List>
    </div>
  );
}

export default DisplayRestaurants;
