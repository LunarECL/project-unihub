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
  CircularProgress,
  AlertColor,
  AlertTitle,
  Alert,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useEffect, useState } from 'react';
import { useGetCourses } from '@unihub/webapp/api';
import { useNavigate } from 'react-router-dom';
import { usePostUserLecture } from '@unihub/webapp/api';
import { useGetUserLectures } from '@unihub/webapp/api';
import { useDeleteUserLecture } from '@unihub/webapp/api';
import styles from './webapp-timetable.module.css';
import { useTheme } from '@mui/material/styles';

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
  section: string,
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
  '#258767',
  '#d7edf4',
  '#b83999',
  '#237283',
  '#e71e54',
  '#e1a8c1',
  '#43147c',
  '#7f7896',
  '#180c80',
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

let allCourses: any[] = [];
let colIndex = 0;

interface IAlert {
  type: AlertColor;
  message: string;
}

export function WebappTimetable() {
  const theme = useTheme();
  const [coursesRows, setCoursesRows] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const [allCoursesRows, setAllCoursesRows] = useState<any>([]);
  const [search, setSearch] = useState('Code');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<IAlert | null>(null);

  const postUserLectureMutation = usePostUserLecture();

  let hasDisplayed = false;

  const navigate = useNavigate();

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;

    if (searchWord === '') {
      setCoursesRows(allCoursesRows);
      setSearch('Code');
      return;
    }

    const newFilter = allCoursesRows.filter((course: any) => {
      if (search === 'Code') {
        return course.programCode
          .toLowerCase()
          .includes(searchWord.toLowerCase());
      } else if (search === 'Name') {
        return course.courseTitle
          .toLowerCase()
          .includes(searchWord.toLowerCase());
      }
    });

    setCoursesRows(newFilter);
  }; //end handleFilter

  const displayCourse = (course: any, isRemove: boolean) => {
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

        const date = new Date(lecture.startTime);

        let startTime = date.getUTCHours();

        let endTime = startTime + lecture.totalMinutes / 60;

        if (endTime > 12 && startTime > 12) {
          endTime = endTime - 12;
        }

        if (startTime > 12) {
          startTime = startTime - 12;
        }

        let iteration = 0;

        //Colour in the cells of the timetable
        for (let i = startTime; i < endTime; i++, iteration++) {
          const row = rows.find((row) => row.time === i + ':00');
          if (row) {
            const cell = document.querySelector(
              `[data-day="${day}-${row.time}"]`
            );
            if (cell) {
              if (isRemove) {
                //Remove everything
                (cell as HTMLElement).innerHTML = '';
                (cell as HTMLElement).style.backgroundColor = 'transparent';
                (cell as HTMLElement).style.border = '';
                (cell as HTMLElement).style.borderColor = '';
              } else {
                (cell as HTMLElement).style.backgroundColor = colours[colIndex];
                (cell as HTMLElement).classList.add(styles.ClassCell);
                if (iteration === 0) {
                  (cell as HTMLElement).innerHTML = course.course.programCode;
                  //Add an x button
                  const xButton = document.createElement('button');
                  xButton.innerText = 'x';
                  xButton.classList.add(styles.xButton);
                  (cell as HTMLElement).appendChild(xButton);

                  //Add a click event listener to the x button
                  xButton.addEventListener('click', (event) => {
                    event.stopPropagation(); //Prevent the click event from bubbling up to the cell element
                    handleDelete(course.id);
                  });
                } //end if
                (cell as HTMLElement).style.borderBottomColor =
                  colours[colIndex];
                //Add an x button
                (cell as HTMLElement).addEventListener('click', () => {
                  navigate(
                    `/home/sharedDocument/${course.course.programCode}/${course.id}/${course.lectures[index].id}`
                  );

                  //Set the hasDisplayed back to false
                  hasDisplayed = false;
                });
              }
            }
          }

          iteration++;
        }
      });
      colIndex = (colIndex + 1) % colours.length;
    }
  };

  const { isLoading: userLecturesLoading, data: userLectures } =
    useGetUserLectures();
  const { isLoading: fetchedCoursesLoading, data: fetchedCourses } =
    useGetCourses();

  useEffect(() => {
    if (!userLecturesLoading && userLectures && !hasDisplayed) {
      userLectures.forEach((course: any) => {
        displayCourse(course, false);
        allCourses.push(course);
      });
      hasDisplayed = true;
    }
  }, [userLecturesLoading, userLectures]);

  useEffect(() => {
    if (!fetchedCoursesLoading && fetchedCourses) {
      setCourses(fetchedCourses);
      const rows = fetchedCourses.map((course: any) => {
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
      setLoading(false);
    }
  }, [fetchedCoursesLoading, fetchedCourses]);

  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event?.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, bottom: open });
      if (open === false) {
        (document.getElementById('outlined-search') as HTMLInputElement).value =
          '';
        setCoursesRows(allCoursesRows);
      }
    };

  const { mutate: deleteUserLecture } = useDeleteUserLecture();

  const handleDelete = (sectionId: string) => {
    colIndex = (colIndex - 1) % colours.length;
    deleteUserLecture(sectionId, {
      onSuccess: () => {
        const course = allCourses.find(
          (course: any) => course.id === sectionId
        );
        if (course) {
          displayCourse(course, true);
        }

        allCourses = allCourses.filter(
          (course: any) => course.id !== sectionId
        );
      },
    });
  };

  // When user clicks on a course, it should be added to the timetable
  const addCourseTime = (index: number) => {
    //Get the index of the course in the courses array from the current index of the course in the coursesRows array
    const courseIndex = allCoursesRows.findIndex(
      (course: any) =>
        course.programCode === coursesRows[index].programCode &&
        course.sec_cd === coursesRows[index].sec_cd &&
        course.section === coursesRows[index].section
    );

    //Check if the course is already in the timetable
    if (
      allCourses.find((course: any) => course.id === courses[courseIndex].id)
    ) {
      return;
    }

    let isConflict = false;

    //Check if the course has conflicts with the courses already in the timetable
    if (allCourses.length > 0) {
      //Check if the course has lectures
      if (courses[courseIndex].lectures) {
        //For each lecture check if it conflicts with the lectures of the courses already in the timetable
        courses[courseIndex].lectures.forEach((lecture: any) => {
          //Check if the lecture conflicts with the lectures of the courses already in the timetable
          allCourses.forEach((course: any) => {
            if (course.lectures) {
              course.lectures.forEach((courseLecture: any) => {
                if (lecture.day === courseLecture.day) {
                  //Check if the lecture conflicts with the lecture of the course already in the timetable

                  const dateCourseLecture = new Date(courseLecture.startTime);
                  const newDate = new Date(
                    dateCourseLecture.getTime() +
                      courseLecture.totalMinutes * 60000
                  );

                  const dateLecture = new Date(lecture.startTime);
                  const newDate2 = new Date(
                    dateLecture.getTime() + lecture.totalMinutes * 60000
                  );
                  if (
                    (dateLecture >= dateCourseLecture &&
                      dateLecture <= newDate) ||
                    (dateCourseLecture >= dateLecture &&
                      dateCourseLecture <= newDate2)
                  ) {
                    setAlert({
                      type: 'error',
                      message: `The course you are trying to add has a conflict with ${course.course.programCode} already in the timetable. We will not add it to your courses.`,
                    });

                    isConflict = true;
                  }
                }
              });
            }
          });
        });
      }
    }

    if (isConflict) {
      toggleDrawer(false)();
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      return;
    }

    postUserLectureMutation.mutate(courses[courseIndex].id);
    allCourses.push(courses[courseIndex]);
    displayCourse(courses[courseIndex], false);
    toggleDrawer(false)();
  };

  return (
    <>
      {alert && (
        <Alert severity={alert.type} className={styles.alert}>
          <AlertTitle>
            {alert.type === 'success' ? 'Success' : 'Error'}
          </AlertTitle>
          {alert!.message}
        </Alert>
      )}
      <Stack direction="row" spacing={'5%'} className={styles.Stack}>
        <TableContainer>
          <Table
            className={styles.Table}
            sx={{ borderColor: theme.palette.secondary.main }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow
                className={styles.TableRowHead}
                sx={{ backgroundColor: theme.palette.secondary.main }}
              >
                <TableCell className={styles.noncenteredcell}>Time</TableCell>
                <TableCell className={styles.centeredcell}>Monday</TableCell>
                <TableCell className={styles.centeredcell}>Tuesday</TableCell>
                <TableCell className={styles.centeredcell}>Wednesday</TableCell>
                <TableCell className={styles.centeredcell}>Thursday</TableCell>
                <TableCell className={styles.centeredcell}>Friday</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.time} className={styles.TableRow}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={styles.TableTime}
                    sx={{ color: theme.palette.secondary.main }}
                  >
                    {row.time}
                  </TableCell>
                  <TableCell
                    data-day={`monday-${row.time}`}
                    className={styles.centeredcell}
                  >
                    {row.monday}
                  </TableCell>
                  <TableCell
                    data-day={`tuesday-${row.time}`}
                    className={styles.centeredcell}
                  >
                    {row.tuesday}
                  </TableCell>
                  <TableCell
                    data-day={`wednesday-${row.time}`}
                    className={styles.centeredcell}
                  >
                    {row.wednesday}
                  </TableCell>
                  <TableCell
                    data-day={`thursday-${row.time}`}
                    className={styles.centeredcell}
                  >
                    {row.thursday}
                  </TableCell>
                  <TableCell
                    data-day={`friday-${row.time}`}
                    className={styles.centeredcell}
                  >
                    {row.friday}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton
          className={styles.AddButtonContainer}
          onClick={toggleDrawer(true)}
        >
          <AddCircleOutlineIcon
            className={styles.AddButtonIcon}
            sx={{ color: theme.palette.primary.main }}
          />
        </IconButton>
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
            id="drawer"
          >
            {loading ? (
              <Grid item xs={12} className={styles.Loading}>
                <CircularProgress />
              </Grid>
            ) : (
              <Box role="presentation" className={styles.Box}>
                <TableContainer className={styles.CourseListContainer}>
                  <Grid container className={styles.DrawerGrid} spacing={5}>
                    <Grid item className={styles.GridItemSearchBar}>
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
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            onClick={() => setSearch(option.value)}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow className={styles.TableRowHead}>
                        <TableCell
                          className={styles.DrawerTableText}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Course Code
                        </TableCell>
                        <TableCell
                          className={styles.DrawerTableText}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Course Title
                        </TableCell>
                        <TableCell
                          className={styles.DrawerTableText}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Course Section
                        </TableCell>
                        <TableCell
                          className={styles.DrawerTableText}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Instructor
                        </TableCell>
                        <TableCell
                          className={styles.DrawerTableText}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Lecture/Tutorial
                        </TableCell>
                        <TableCell
                          className={styles.DrawerTableText}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Delivery Mode
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody id="coursesDisplay">
                      {coursesRows
                        .slice(0, 100)
                        .map((row: any, index: number) => (
                          <TableRow
                            key={index}
                            className={styles.TableRowList}
                            onClick={() => {
                              addCourseTime(index);
                            }}
                          >
                            <TableCell
                              className={styles.DrawerTableText}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {row.programCode}
                            </TableCell>
                            <TableCell
                              className={styles.DrawerTableText}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {row.courseTitle}
                            </TableCell>
                            <TableCell
                              className={styles.DrawerTableText}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {row.sec_cd}
                            </TableCell>
                            <TableCell
                              className={styles.DrawerTableText}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {row.prof}
                            </TableCell>
                            <TableCell
                              className={styles.DrawerTableText}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {row.section}
                            </TableCell>
                            <TableCell
                              className={styles.DrawerTableText}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {row.deliveryMode}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </SwipeableDrawer>
        </Drawer>
      </Stack>
    </>
  );
}
