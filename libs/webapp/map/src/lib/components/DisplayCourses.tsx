import './Components.css';
import { List, ListItem } from '@mui/material';
import { useGetUserLectures } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';
import placeholder from '../assets/unihat.png';
import { useTheme } from '@mui/material/styles';

export interface DisplayCoursesProps {
  changeMapFocus: (
    location: string,
    latitute?: string,
    longitude?: string
  ) => void;
}

export function DisplayCourses(props: DisplayCoursesProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const theme = useTheme();

  useEffect(() => {
    useGetUserLectures().then((res) => {
      setCourses(res);
    });
  }, []);

  if (courses.length === 0) {
    // return "No friends found"
    return <div>No courses found</div>;
  } else {
    const courselist = courses.map((course) => (
      <ListItem
        key={course.course.programCode}
        className="panel"
        style={{ borderBottomColor: theme.palette.secondary.main }}
        onClick={() => props.changeMapFocus(course.lectures[0].building)}
      >
        <div id={'id' + course.course.programCode} className="logoDiv">
          <img src={placeholder} alt="logo" className="logo" />
        </div>

        <div className="info" style={{ color: theme.palette.secondary.main }}>
          {course.course.programCode}
        </div>
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
