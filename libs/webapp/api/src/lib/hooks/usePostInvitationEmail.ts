import axios from 'axios';

const query = async (email: string, groupName: string, groupId: string) => {
  const url = `/api/email/invitation`;

  const res = await axios.post(url, {
    email,
    groupName,
    groupId,
  });

  return res.data;
};

export function usePostInvitationEmail(
  email: string,
  groupName: string,
  groupId: string
) {
  return query(email, groupName, groupId);
}
