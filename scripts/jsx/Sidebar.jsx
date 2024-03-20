import Grid from "@mui/material/Grid";
import { Typography, Box } from "@mui/material";
import { Outlet, Link } from "react-router-dom";

function Sidebar() {
    return (
        <Grid container flexWrap="nowrap">
            <Grid container sx={{ width: "250px" }} alignContent="start">
                <Grid sx={{ width: "100%", height: 'min-content' }}>
                    <Typography textAlign="center" variant="h5">
                        SIDEBAR
                    </Typography>
                </Grid>
                <Grid flexDirection="column">
                    <Grid>
                        <Link to="/">all</Link>
                    </Grid>
                    <Grid>
                        <Link to="/album/a">a</Link>
                    </Grid>
                    <Grid>
                        <Link to="/album/b">b</Link>
                    </Grid>
                </Grid>
            </Grid>
            <Outlet />
        </Grid>
    );
}

export default Sidebar;
