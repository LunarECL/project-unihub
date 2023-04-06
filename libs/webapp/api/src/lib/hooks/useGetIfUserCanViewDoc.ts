// useGetIfUserCanViewDoc.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchUserCanViewDoc = async (documentId: string) => {
  const res = await axios.get('/api/shareDoc/document/user/canView', {
    params: {
      documentId: documentId,
    },
  });

  return res.data;
};

export function useGetIfUserCanViewDoc(documentId: string) {
  return useQuery(['userCanViewDoc', documentId], () =>
    fetchUserCanViewDoc(documentId)
  );
}

export default useGetIfUserCanViewDoc;
