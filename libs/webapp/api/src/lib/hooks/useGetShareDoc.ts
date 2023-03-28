import axios from 'axios';

const query = async () => {
  const res = await axios.get('https://api.unihub.one/api/sharedoc');
  return res.data;
};

export function useGetShareDoc() {
  return query();
}
