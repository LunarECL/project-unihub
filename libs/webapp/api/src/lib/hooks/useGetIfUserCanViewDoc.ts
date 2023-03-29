import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (documentId: string) => {
  const res = await axios.get(
    '/api/shareDoc/document/user/canView',
    // 'http://localhost:3333/api/shareDoc/document/user/canView',
    {
      params: {
        documentId: documentId,
      },
    }
  );

  return res.data;
};

export function useGetIfUserCanViewDoc(documentId: string) {
  return query(documentId);
}

export default useGetIfUserCanViewDoc;
