import axios from 'axios';

const query = async (lectureId: string, documentName: string) => {
  const url = `/api/sharedoc/document/user/create`;

  const res = await axios.post(url, {
    lectureId,
    documentName,
  });

  return res.data;
};

export function usePostUserDocument(lectureId: string, documentName: string) {
  return query(lectureId, documentName);
}

export default usePostUserDocument;
