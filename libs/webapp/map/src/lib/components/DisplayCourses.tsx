import './components.css';
import { List, ListItem } from '@mui/material';
import { useGetUserLectures } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';
import placeholder from '../assets/unihat.png';

export interface DisplayCoursesProps {
  changeMapFocus: (
    location: string,
    latitute?: string,
    longitude?: string
  ) => void;
}

export function DisplayCourses(props: DisplayCoursesProps) {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    useGetUserLectures().then((res) => {
      setCourses(res);
    });
  }, []);

  if (courses.length === 0) {
    // return "No friends found"
    return <div>No friends found</div>;
  } else {
    const courselist = courses.map((course) => (
      <ListItem
        key={course.course.programCode}
        className="panel"
        onClick={() => props.changeMapFocus(course.lectures[0].building)}
      >
        <div id={'id' + course.course.programCode} className="logoDiv">
          <img src={placeholder} alt="logo" className="logo" />
        </div>

        <div className="info">{course.course.programCode}</div>
      </ListItem>
    ));

    return (
      <div>
        <List>{courselist}</List>
      </div>
    );
  }
}

export default DisplayCourses;
