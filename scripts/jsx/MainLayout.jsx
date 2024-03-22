import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { Box, AppBar, Grid, Toolbar, Button } from "@mui/material";

function MainLayout() {
    return (
        <Grid>
            {/* <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ display: "flex" }}>
                        <Button color="inherit" component={Link} to="/signup">
                            Sign Up
                        </Button>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar> */}
            <Grid container flexWrap="nowrap">
                <Sidebar />
                <Outlet />
            </Grid>
        </Grid>
    );
}

export default MainLayout;
