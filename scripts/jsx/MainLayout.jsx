import { Outlet, Link } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { queryClient } from "./App.jsx";
import { Box, AppBar, Grid, Toolbar, Button, Typography } from "@mui/material";

function MainLayout() {
    const { user, signOut } = useAuthenticator();
    console.log(user);

    const navigate = useNavigate();

    return (
        <Grid>
            <AppBar position="static">
                <Toolbar>
                    <Typography>{`Logged in as: ${user.username}`}</Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ display: "flex" }}>
                        {/* <Button color="inherit" component={Link} to="/signup">
                            Sign Up
                        </Button>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button> */}
                        <Button
                            color="inherit"
                            onClick={() => {
                                navigate("/");
                                signOut();
                            }}
                        >
                            <Typography>Signout</Typography>
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Grid container flexWrap="nowrap">
                <Sidebar />
                <Outlet />
            </Grid>
        </Grid>
    );
}

export default MainLayout;
