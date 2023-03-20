import styles from './webapp-share-doc-list.module.css';
import { useParams } from 'react-router-dom';
import { useGetAllDocuments } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface WebappShareDocListProps {}

interface Document {
  id: string;
  lectureNumber: string;
  lectureId: string;
}

export function WebappShareDocList(props: WebappShareDocListProps) {
  // //Get the courseCode, sessionId, lectureId from the url
  const { courseCode, sessionId, lectureId } = useParams();

  // Use state to store the documents and loading status
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function fetchDocuments() {
      const res = await useGetAllDocuments(lectureId !== undefined ? lectureId : '');
      setDocuments(res);
    }
    fetchDocuments();
  }, [lectureId]);

  const navigator = (docId: string, lectureNumber:string) => {
    window.location.href = `/home/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${docId}/${lectureNumber}`;
  };


  return (
    <div className={styles['container']}>
      <h1>{courseCode} lecture documents</h1>
      {documents.map((doc) => (
        <div key={doc.id}>
          <h2 style={{ cursor: 'pointer' }} onClick={() => navigator(doc.id, doc.lectureNumber)}>{doc.lectureNumber}</h2>
        </div>
      ))}
    </div>
  );
}

export default WebappShareDocList;
