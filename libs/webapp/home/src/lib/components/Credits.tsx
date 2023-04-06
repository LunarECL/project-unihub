import {
  Grid,
  Tab,
  Typography,
} from '@mui/material';
import './navbar.css';
import './credits.css';

/* eslint-disable-next-line */
export interface CreditsProps {}

export function Credits(props: CreditsProps) {
  return (
    <Grid container direction="row" className="PageDims" spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h3" color="primary">
          Credits!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" color="primary">
          UI:
        </Typography>
        <Typography variant="h6" color="secondary">
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          1. MaterialUI docs https://mui.com/
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          2. Colour scheme from
          https://www.canva.com/learn/website-color-schemes/
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          3. Colour scheme from
          https://www.canva.com/learn/website-color-schemes/
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          4. Most Images from freepik: https://www.freepik.com/
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          5. Video Icon from very icon:
          https://www.veryicon.com/icons/miscellaneous/two-color-icon-library/user-286.html
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" color="primary">
          API's/libararies we used:
        </Typography>
        <Typography variant="h6" color="secondary">
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          1. ShareDB: https://github.com/share/sharedb
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          2. WebRTC and ion-sfu: https://webrtc.org/,
          https://github.com/ionorg/ion-sfu
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          3. Auth0: https://auth0.com/
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          4. Bull/Redis for queueing: https://github.com/OptimalBits/bull
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" color="primary">
          General:
        </Typography>
        <Typography variant="h6" color="secondary">
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          1. Stack Overflow :D
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          2. Youtube
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          3. ChatGPT
          <br />
          <Tab sx={{ minWidth: 0, mr: 1 }} />
          4. TA's, we love you!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Credits;
