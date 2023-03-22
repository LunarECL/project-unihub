import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (lectureId: string) => {
  // const url = '/api/sharedoc/documents'; //switch back for docker
  const url = 'http://localhost:3333/api/sharedoc/documents'; 

  const res = await axios.get(url, {
    params: {
      lectureId: lectureId,
    },
  });

  return res.data;
};

export function useGetAllDocuments(lectureId: string) {
  return query(lectureId);
}

export default useGetAllDocuments;
