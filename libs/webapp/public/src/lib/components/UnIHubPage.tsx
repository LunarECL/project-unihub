import { Grid, Typography } from '@mui/material';
import './UnIHub.css';
import { useTheme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface UnIHubPageProps {}

export function UnIHubPage(props: UnIHubPageProps) {
  const theme = useTheme();
  return (
    <>
      <Grid container direction="row" className="UnIHubContainer" spacing={10}>
        <Grid item xs={4} className="UnIHubImageContainer">
          <div className="UnIHubImage"></div>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column" className="AboutContainer">
            <Grid item xs={12}>
              <Typography className="UnIHubAbout" color="primary">
                About
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="UnIHubAboutPara" color="primary">
                UnIHub is your one-stop-shop that caters to all the tools and
                resources you need to excel in your academic journey!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} className="CardsContainer">
        <Grid item xs={3} className="CardsItems" sx={{background: theme.palette.secondary.main}}>
          <Grid container direction="row" className="InsideCardItem">
            <Grid item xs={12}>
              <div className="CardVideoChatImage"></div>
            </Grid>
            <Grid item xs={12}>
              <Typography className="CardText">
                Looking to connect with other students? You can video chat with
                fellow students no need to leave the site!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} className="CardsItems" sx={{background: theme.palette.secondary.main}}>
          <Grid container direction="row" className="InsideCardItem">
            <Grid item xs={12}>
              <div className="CardNoteTakingImage"></div>
            </Grid>
            <Grid item xs={12}>
              <Typography className="CardText">
                Offer a live note-taking feature, which allows you to
                collaborate with other students during lectures, making studying
                easier and more efficient.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} className="CardsItems" sx={{background: theme.palette.secondary.main}}>
          <Grid container direction="row" className="InsideCardItem">
            <Grid item xs={12}>
              <div className="CardMapImage"></div>
            </Grid>
            <Grid item xs={12}>
              <Typography className="CardText">
                Lost on campus? UnIHub's live tracking feature allows you to see
                the real-time location of your friends, making meeting up with
                them a breeze.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default UnIHubPage;
