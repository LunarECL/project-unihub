import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Drawer,
  Box,
  SwipeableDrawer,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useEffect, useState } from 'react';
import { useGetCourses } from '@unihub/webapp/api';
import { useNavigate, useParams } from 'react-router-dom';
/* eslint-disable-next-line */
export interface WebappTimetableProps {}

function createData(
  time: string,
  monday: string,
  tuesday: string,
  wednesday: string,
  thursday: string,
  friday: string
) {
  return { time, monday, tuesday, wednesday, thursday, friday };
} //end createDate

function createCourseData(
  programCode: string,
  courseTitle: string,
  sec_cd: string,
  prof: string,
  section: string, //sectionType + sectionNumber
  deliveryMode: string
) {
  return { programCode, courseTitle, sec_cd, prof, section, deliveryMode };
}

const rows = [
  createData('9:00', '', '', '', '', ''),
  createData('10:00', '', '', '', '', ''),
  createData('11:00', '', '', '', '', ''),
  createData('12:00', '', '', '', '', ''),
  createData('1:00', '', '', '', '', ''),
  createData('2:00', '', '', '', '', ''),
  createData('3:00', '', '', '', '', ''),
  createData('4:00', '', '', '', '', ''),
  createData('5:00', '', '', '', '', ''),
  createData('6:00', '', '', '', '', ''),
  createData('7:00', '', '', '', '', ''),
  createData('8:00', '', '', '', '', ''),
];

const colours = [
  "#258767",
  "#d7edf4",
  "#b83999",
  "#237283",
  "#e71e54",
  "#e1a8c1",
  "#43147c",
  "#7f7896",
  "#180c80"
];

const searchOpt = [
  {
    value: 'Code',
    label: 'Course Code',
  },
  {
    value: 'Name',
    label: 'Course Name',
  },
];

export function WebappTimetable(props: WebappTimetableProps) {
  const [coursesRows, setCoursesRows] = useState([]); //'filtered' courses
  const [courses, setCourses] = useState([]);
  const [colIndex, setColIndex] = useState(0);
  const [allCoursesRows, setAllCoursesRows] = useState([]);
  const [search, setSearch] = useState('Code'); //search word

  const navigate = useNavigate();

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;  
    
    if(searchWord === ''){
      setCoursesRows(allCoursesRows);
      setSearch('Code')
      return;
    }

    const newFilter = allCoursesRows.filter((course: any) => {
      if(search === 'Code'){
        return course.programCode.toLowerCase().includes(searchWord.toLowerCase());
      }
      else if(search === 'Name'){
        return course.courseTitle.toLowerCase().includes(searchWord.toLowerCase());
      }
    });

    setCoursesRows(newFilter);
  }//end handleFilter

  useEffect(() => {
    async function loadCourses() {
      const courses = await useGetCourses();
      setCourses(courses);
      const rows = courses.map((course: any) => {
        return createCourseData(
          course.course.programCode,
          course.course.title,
          course.course.sec_cd,
          course.instructor,
          course.sectionType + course.sectionNumber,
          course.delivery_mode
        );
      });
      setAllCoursesRows(rows);
      setCoursesRows(rows);
    }
    loadCourses();
  }, []);

  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, bottom: open });
    };

  //Need to deal with conflicts but that'll be when we store the courses in an array or smthn
    //So using the db
  const displayCourse = (course: any) => {
    //Check if the course has lectures
    if (course.lectures) {
      //For each lecture display it on the timetable
      course.lectures.forEach((lecture: any, index: number) => {
        let day = '';
        // Display the lecture on the timetable
        if (lecture.day === 0) {
          day = 'monday';
        } else if (lecture.day === 1) {
          day = 'tuesday';
        } else if (lecture.day === 2) {
          day = 'wednesday';
        } else if (lecture.day === 3) {
          day = 'thursday';
        } else if (lecture.day === 4) {
          day = 'friday';
        }

        let lecTime = new Date(lecture.startTime);
        let startTime = lecTime.getHours();
        let endTime = startTime + lecture.totalMinutes / 60;

        if (endTime > 12 && startTime > 12) {
          endTime = endTime - 12;
        }

        if (startTime > 12) {
          startTime = startTime - 12;
        }

        let iteration: number = 0

        //Colour in the cells of the timetable
        for (let i = startTime; i < endTime; i++, iteration++) {
          let row = rows.find((row) => row.time === i + ':00');
          if (row) {
            const cell = document.querySelector(
              `[data-day="${day}-${row.time}"]`
            );
            if (cell) {
              (cell as HTMLElement).style.backgroundColor = colours[colIndex];
              setColIndex((colIndex + 1) % colours.length);
              (cell as HTMLElement).style.color = 'white';
              (cell as HTMLElement).style.fontWeight = 'bold';
              if (iteration === 0) {
                (cell as HTMLElement).innerHTML = course.course.programCode;
              }//end if
              //Colour in the cells of the timetable
              (cell as HTMLElement).style.borderBottomColor = colours[colIndex];
              (cell as HTMLElement).style.cursor = 'pointer';
              (cell as HTMLElement).addEventListener('click', () => {
                navigate(`/home/sharedDocument/${course.course.programCode}/${course.id}/${course.lectures[index].id}`);
              });
            }
          }

          iteration++;
        }
      });
    }
  };

  // When user clicks on a course, it should be added to the timetable
  const addCourseTime = (index: number) => {
    displayCourse(courses[index]);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={10}
        sx={{ marginLeft: '5%', marginRight: '5%', marginTop: '3%' }}
      >
        <TableContainer>
          <Table
            sx={{ border: 1, borderColor: 'lightgrey' }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow sx={{ fontWeight: 'medium' }}>
                <TableCell>Time</TableCell>
                <TableCell align="center">Monday</TableCell>
                <TableCell align="center">Tuesday</TableCell>
                <TableCell align="center">Wednesday</TableCell>
                <TableCell align="center">Thursday</TableCell>
                <TableCell align="center">Friday</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.time}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell data-day={`monday-${row.time}`} align="center">
                    {row.monday}
                  </TableCell>
                  <TableCell data-day={`tuesday-${row.time}`} align="center">
                    {row.tuesday}
                  </TableCell>
                  <TableCell data-day={`wednesday-${row.time}`} align="center">
                    {row.wednesday}
                  </TableCell>
                  <TableCell data-day={`thursday-${row.time}`} align="center">
                    {row.thursday}
                  </TableCell>
                  <TableCell data-day={`friday-${row.time}`} align="center">
                    {row.friday}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton
          sx={{ maxHeight: 50, maxWidth: 50 }}
          onClick={toggleDrawer(true)}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 45 }} />
        </IconButton>
        {/* Wanna fix so drawer doesn't just pop up */}
        <Drawer
          anchor="top"
          open={state['bottom']}
          onClose={toggleDrawer(false)}
        >
          <SwipeableDrawer
            anchor="bottom"
            open={state['bottom']}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              // sx={{ width: 'auto' }}
              role="presentation"
              sx={{
                bottom: 0,
                left: 0,
                right: 0,
                height: '60vh',
                padding: '1rem',
              }}
            >
              <TableContainer sx={{ width: '90%', margin: '0 auto' }}>
                <Grid
                  container
                  sx={{ marginTop: '2%', marginBottom: '2%' }}
                  spacing={5}
                >
                  <Grid item sx={{ width: '75%' }}>
                    <TextField
                      id="outlined-search"
                      label="Find your course"
                      type="search"
                      onChange={handleFilter}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="outlined-select-search"
                      select
                      label="Search choice"
                      defaultValue="Code"
                      helperText="Please select how you would like to search by"
                    >
                      {searchOpt.map((option) => (
                        <MenuItem key={option.value} value={option.value} onClick={() => setSearch(option.value)}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ fontWeight: 'medium' }}>
                      <TableCell align="center">Course Code</TableCell>
                      <TableCell align="center">Course Title</TableCell>
                      <TableCell align="center">Course Section</TableCell>
                      <TableCell align="center">Instructor</TableCell>
                      <TableCell align="center">Lecture/Tutorial</TableCell>
                      <TableCell align="center">Delivery Mode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody id="coursesDisplay">
                    {coursesRows.slice(0,100).map((row: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                        }}
                        onClick={() => addCourseTime(index)}
                      >
                        <TableCell align="center">{row.programCode}</TableCell>
                        <TableCell align="center">{row.courseTitle}</TableCell>
                        <TableCell align="center">{row.sec_cd}</TableCell>
                        <TableCell align="center">{row.prof}</TableCell>
                        <TableCell align="center">{row.section}</TableCell>
                        <TableCell align="center">{row.deliveryMode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </SwipeableDrawer>
        </Drawer>
      </Stack>
    </>
  );
}

export default WebappTimetable;

