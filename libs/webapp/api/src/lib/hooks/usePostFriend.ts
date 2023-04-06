import axios from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

async function postFriend(friendEmail: string): Promise<any> {
  const url = `/api/friends`;
  // const url = '/apiapi/friends`;

  const res = await axios.post(url, {
    friendEmail,
  });

  return res.data;
}

export function usePostFriend(): UseMutationResult<
  any,
  unknown,
  string,
  unknown
> {
  return useMutation(postFriend);
}

export default usePostFriend;
