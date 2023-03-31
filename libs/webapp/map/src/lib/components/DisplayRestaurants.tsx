import './components.css';
import { List, ListItem } from '@mui/material';
import { restaurantList } from '../assets/Restaurants';

/* eslint-disable-next-line */
export interface DisplayRestaurantsProps {}

export function DisplayRestaurants(props: DisplayRestaurantsProps) {
  const restaurants = restaurantList.map((restaurant) => (
    <ListItem key={restaurant.name} className="panel">
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
