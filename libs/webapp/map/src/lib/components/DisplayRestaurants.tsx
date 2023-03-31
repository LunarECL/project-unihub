import './Components.css';
import { List, ListItem } from '@mui/material';
import { restaurantList } from '../assets/Restaurants';
import { useTheme } from '@mui/material/styles';

export interface DisplayRestaurantsProps {
  changeMapFocus: (
    location: string,
    latitute?: string,
    longitude?: string
  ) => void;
}

export function DisplayRestaurants(props: DisplayRestaurantsProps) {
  const theme = useTheme();
  const restaurants = restaurantList.map((restaurant) => (
    <ListItem
      key={restaurant.name}
      className="panel"
      style={{ borderBottomColor: theme.palette.secondary.main }}
      onClick={() => props.changeMapFocus(restaurant.name)}
    >
      <div id={'id' + restaurant.name} className="logoDiv">
        <img src={restaurant.logo} alt="logo" className="logo" />
      </div>

      <div className="info" style={{ color: theme.palette.secondary.main }}>
        {restaurant.name}
      </div>
    </ListItem>
  ));

  return (
    <div>
      <List>{restaurants}</List>
    </div>
  );
}

export default DisplayRestaurants;
