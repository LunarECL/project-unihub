// useGetDocumentContent.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchDocumentContent = async (documentId: string) => {
  const url = `/api/sharedoc/document/content`;
  const res = await axios.get(url, { params: { documentId } });
  return res.data;
};

export function useGetDocumentContent(documentId: string) {
  return useQuery(['getDocumentContent', documentId], () =>
    fetchDocumentContent(documentId)
  );
}

export default useGetDocumentContent;
