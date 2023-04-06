import axios from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

interface InvitationEmailParams {
  email: string;
  groupName: string;
  groupId: string;
}

async function postInvitationEmail({
  email,
  groupName,
  groupId,
}: InvitationEmailParams): Promise<any> {
  const url = `/api/email/invitation`;

  const res = await axios.post(url, {
    email,
    groupName,
    groupId,
  });

  return res.data;
}

export function usePostInvitationEmail(): UseMutationResult<
  any,
  unknown,
  InvitationEmailParams,
  unknown
> {
  return useMutation(postInvitationEmail);
}
