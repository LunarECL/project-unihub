import styles from './webapp-timetable.module.css';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Grid, AppBar, Toolbar, Typography, IconButton } from '@mui/material';

/* eslint-disable-next-line */
export interface WebappTimetableProps {}

function createData(
  time: string,
  monday: string,
  tuesday: string,
  wednesday: string,
  thursday: string,
  friday: string,
) {
  return { time, monday, tuesday, wednesday, thursday, friday };
}//end createDate

function rowKey(row: { time: string; }) {
  return row.time;
}//end rowKey

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

export function WebappTimetable(props: WebappTimetableProps) {
  return (
    <>
    <TableContainer sx={{ marginLeft: '5%', marginRight: '10%', marginTop: '2%' }}>
        <Table sx={{ maxWidth: '80%', maxHeight: '80%' }} aria-label="simple table">
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
    </>
  );
}

export default WebappTimetable;
