import axios from 'axios';

const query = async (documentId: string) => {
  const url = 'api/sharedoc/document/content';

  const res = await axios.get(url, {
    params: {
      documentId: documentId,
    },
  });

  return res.data;
};

export function useGetDocumentContent(documentId: string) {
  return query(documentId);
}

export default useGetDocumentContent;
