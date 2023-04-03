import axios from 'axios';

const query = async (friendEmail: string) => {
  const url = `/api/friends/accept`;
  //   const url = `http://localhost:3333/api/friends/accept`;

  const res = await axios.patch(url, {
    friendEmail,
  });

  return res.data;
};

export function usePatchAcceptFriend(friendEmail: string) {
  return query(friendEmail);
}

export default usePatchAcceptFriend;
