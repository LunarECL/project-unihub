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
import React from 'react';
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
                <TableCell align="right">Monday</TableCell>
                <TableCell align="right">Tuesday</TableCell>
                <TableCell align="right">Wednesday</TableCell>
                <TableCell align="right">Thursday</TableCell>
                <TableCell align="right">Friday</TableCell>
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
                  <TableCell align="right">{row.monday}</TableCell>
                  <TableCell align="right">{row.tuesday}</TableCell>
                  <TableCell align="right">{row.wednesday}</TableCell>
                  <TableCell align="right">{row.thursday}</TableCell>
                  <TableCell align="right">{row.friday}</TableCell>
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
        <Drawer
          anchor="bottom"
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
              sx={{ width: 'auto' }}
              role="presentation"
              onKeyDown={toggleDrawer(false)}
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
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ fontWeight: 'medium' }}>
                      <TableCell align="center">Course Title</TableCell>
                      <TableCell align="center">Course Code</TableCell>
                      <TableCell align="center">Lecture section</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.time}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="right">{row.monday}</TableCell>
                        <TableCell align="right">{row.tuesday}</TableCell>
                        <TableCell align="right">{row.monday}</TableCell>
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
