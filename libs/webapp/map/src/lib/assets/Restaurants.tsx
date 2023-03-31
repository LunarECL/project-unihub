export type displayRestaurant = {
  name: string;
  logo: string;
  open: boolean;
};

// we have Subway, PitaLite, Hero Burger, KFC, Starbucks, Tim Hortons

export const restaurantList: displayRestaurant[] = [
  {
    name: 'Starbucks',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    open: true,
  },
  {
    name: 'Subway',
    logo: 'https://i.insider.com/57b231c1db5ce94f008b6df4?width=750&format=jpeg&auto=webp',
    open: true,
  },
  {
    name: 'Hero Burger',
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Hero_Certified_Burgers_logo.png',
    open: true,
  },
  {
    name: 'KFC',
    logo: 'https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png',
    open: true,
  },
  {
    name: 'Tim Hortons',
    logo: 'https://assets.fontsinuse.com/static/use-media-items/169/168201/full-1036x1003/62ed2598/Tim_Hortons_Maple_Leaf.png',
    open: true,
  },
];
