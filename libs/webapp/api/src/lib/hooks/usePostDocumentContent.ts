import axios from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

interface PostDocumentContentParams {
  documentId: string;
  ops: Object[];
}

async function postDocumentContent({
  documentId,
  ops,
}: PostDocumentContentParams): Promise<any> {
  const url = `/api/sharedoc/document/content`;
  // const url = 'http://localhost:3333/api/sharedoc/document/content';

  const res = await axios.post(url, {
    documentId,
    ops,
  });

  return res.data;
}

export function usePostDocumentContent(): UseMutationResult<
  any,
  unknown,
  PostDocumentContentParams,
  unknown
> {
  return useMutation(postDocumentContent);
}

export default usePostDocumentContent;
