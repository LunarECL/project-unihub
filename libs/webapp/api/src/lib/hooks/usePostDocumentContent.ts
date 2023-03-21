import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (documentId: string, content: string) => {
  const url = `http://localhost:3333/api/sharedoc/document/content?documentId=${documentId}&content=${content}`;

  const res = await axios.post(url);

  return res.data;
};

export function usePostDocumentContent(documentId: string, content: string) {
  return query(documentId, content);
}

export default usePostDocumentContent;
