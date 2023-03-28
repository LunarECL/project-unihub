import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (lectureId: string, documentName: string) => {
  const url = `/api/sharedoc/document/user/create`;
  // const url = 'http://localhost:3333/api/sharedoc/document/user/create';

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
