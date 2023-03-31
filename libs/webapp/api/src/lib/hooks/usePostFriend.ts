import axios from 'axios';

const query = async (friendEmail: string) => {
  //   const url = `/api/friends`;
  const url = `http://localhost:3333/api/friends`;

  const res = await axios.post(url, {
    friendEmail,
  });

  return res.data;
};

export function usePostFriend(friendEmail: string) {
  return query(friendEmail);
}

export default usePostFriend;
