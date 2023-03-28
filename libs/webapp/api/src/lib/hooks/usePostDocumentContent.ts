import axios from 'axios';
import { useQuery } from 'react-query';

// eslint-disable-next-line @typescript-eslint/ban-types
const query = async (documentId: string, ops: Object[]) => {
  const url = `/api/sharedoc/document/content`;
  // const url = 'http://localhost:3333/api/sharedoc/document/content';

  const res = await axios.post(url, {
    documentId,
    ops,
  });

  return res.data;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function usePostDocumentContent(documentId: string, ops: Object[]) {
  return query(documentId, ops);
}

export default usePostDocumentContent;
