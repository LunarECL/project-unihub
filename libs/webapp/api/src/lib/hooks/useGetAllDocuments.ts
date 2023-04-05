import axios from 'axios';

const query = async (lectureId: string) => {
  const url = '/api/sharedoc/documents';

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
