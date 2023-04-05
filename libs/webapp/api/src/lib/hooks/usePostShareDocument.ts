import axios from 'axios';

const query = async (documentId: string, userEmail: string) => {
  const url = `/api/sharedoc/document/user/share`;

  const res = await axios.post(url, {
    documentId,
    userEmail,
  });

  return res.data;
};

export function usePostShareDocument(documentId: string, userEmail: string) {
  return query(documentId, userEmail);
}

export default usePostShareDocument;
