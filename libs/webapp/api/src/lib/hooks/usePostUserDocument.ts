import axios from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

interface UserDocumentParams {
  lectureId: string;
  documentName: string;
}

async function postUserDocument({
  lectureId,
  documentName,
}: UserDocumentParams): Promise<any> {
  const url = `/api/sharedoc/document/user/create`;
  // const url = 'http://localhost:3333/api/sharedoc/document/user/create';

  const res = await axios.post(url, {
    lectureId,
    documentName,
  });

  return res.data;
}

export function usePostUserDocument(): UseMutationResult<
  any,
  unknown,
  UserDocumentParams,
  unknown
> {
  return useMutation(postUserDocument);
}

export default usePostUserDocument;
