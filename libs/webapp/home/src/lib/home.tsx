import React from 'react';
import { ApiProvider } from '@unihub/webapp/api';
import { Sharedoc } from '@unihub/webapp/sharedoc';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Forum from './forum/forum';
import { WebappTimetable } from '@unihub/webapp/timetable';
import { WebappShareDocList } from '@unihub/webapp/share-doc-list';
import { DisplayRoom, CreateRoom, JoinRoom } from '@unihub/webapp/webrtc';
import NavBar from './components/NavBar';
import Credits from './components/Credits';
import { Button } from '@mui/material';
import './home.css';
import { DisplayMap } from '@unihub/webapp/map';
import { Friends } from '@unihub/webapp/friends';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WebappHomeProps {}

export function Home(props: WebappHomeProps) {
  const navigate = useNavigate();
  return (
    <ApiProvider>
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<Forum />} /> */}
        <Route path="/timetable" element={<WebappTimetable />} />
        <Route
          path="/sharedDocument/:courseCode/:sessionId/:lectureId/:documentId/:lectureNumber" ///sharedDocument/CSCC63/1/1/1
          element={<Sharedoc />}
        />
        <Route
          path="/sharedDocument/:courseCode/:sessionId/:lectureId/"
          element={<WebappShareDocList />}
        />
        <Route path="/rooms/create" element={<CreateRoom />} />
        <Route path="/rooms/join" element={<JoinRoom />} />
        <Route path="/rooms/:roomId" element={<DisplayRoom />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/map" element={<DisplayMap />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
      <Button className="Credit" onClick={() => navigate('/home/credits')}>
        Credits page
      </Button>
    </ApiProvider>
  );
}

export default Home;
