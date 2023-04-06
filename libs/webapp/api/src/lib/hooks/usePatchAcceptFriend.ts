import axios from 'axios';
import { useMutation } from 'react-query';

const patchAcceptFriend = async (friendEmail: string) => {
  const url = `/api/friends/accept`;
  //   const url = `/apifriends/accept`;

  const res = await axios.patch(url, {
    friendEmail,
  });

  return res.data;
};

export function usePatchAcceptFriend() {
  return useMutation(patchAcceptFriend);
}

export default usePatchAcceptFriend;
