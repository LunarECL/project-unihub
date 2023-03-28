import React from 'react';
import { ApiProvider } from '@unihub/webapp/api';
import { Sharedoc } from '@unihub/webapp/sharedoc';
import { Route, Routes } from 'react-router-dom';
import Forum from './forum/forum';
import { WebappTimetable } from '@unihub/webapp/timetable';
import { WebappShareDocList } from '@unihub/webapp/share-doc-list';
import { DisplayRoom, CreateRoom, JoinRoom } from '@unihub/webapp/webrtc';

export interface WebappHomeProps {}

export function Home(props: WebappHomeProps) {
  return (
    <ApiProvider>
      <Routes>
        <Route path="/" element={<Forum />} />
        <Route path="/timetable" element={<WebappTimetable />} />
        <Route
          path="/sharedDocument/:courseCode/:sessionId/:lectureId/:documentId/:lectureNumber" ///sharedDocument/CSCC63/1/1/1
          element={<Sharedoc />}
        />
        <Route
          path="/sharedDocument/:courseCode/:sessionId/:lectureId/"
          element={<WebappShareDocList />}
        />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/join" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<DisplayRoom />} />
      </Routes>
    </ApiProvider>
  );
}

export default Home;
