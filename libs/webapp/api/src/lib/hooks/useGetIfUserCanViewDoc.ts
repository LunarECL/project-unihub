import axios from 'axios';

const query = async (documentId: string) => {
  const res = await axios.get('/api/shareDoc/document/user/canView', {
    params: {
      documentId: documentId,
    },
  });

  return res.data;
};

export function useGetIfUserCanViewDoc(documentId: string) {
  return query(documentId);
}

export default useGetIfUserCanViewDoc;
