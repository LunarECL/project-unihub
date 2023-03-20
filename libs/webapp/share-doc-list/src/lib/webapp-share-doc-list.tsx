import styles from './webapp-share-doc-list.module.css';
import { useParams } from 'react-router-dom';
import { useGetAllDocuments } from '@unihub/webapp/api';

/* eslint-disable-next-line */
export interface WebappShareDocListProps {}

export function WebappShareDocList(props: WebappShareDocListProps) {
  //Get the courseCode, sessionId, lectureId from the url
  const { courseCode, sessionId, lectureId } = useParams();  

  //Get all documents from the backend
  const documents = useGetAllDocuments(lectureId !== undefined ? lectureId : '');
  console.log(documents);

  return (
    <div className={styles['container']}>
      <h1>Welcome to WebappShareDocList!</h1>
    </div>
  );
}

export default WebappShareDocList;
