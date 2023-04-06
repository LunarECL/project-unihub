import axios from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

interface ShareDocumentParams {
  documentId: string;
  userEmail: string;
}

async function postShareDocument({
  documentId,
  userEmail,
}: ShareDocumentParams): Promise<any> {
  const url = `/api/sharedoc/document/user/share`;
  // const url = 'http://localhost:3333/api/sharedoc/document/user/share';

  const res = await axios.post(url, {
    documentId,
    userEmail,
  });

  return res.data;
}

export function usePostShareDocument(): UseMutationResult<
  any,
  unknown,
  ShareDocumentParams,
  unknown
> {
  return useMutation(postShareDocument);
}

export default usePostShareDocument;
