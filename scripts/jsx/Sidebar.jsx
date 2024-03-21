import { useState } from "react";
import Grid from "@mui/material/Grid";
import { queryClient } from "./App.jsx";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

async function fetchAlbums() {
    const response = await fetch("/api/user/album");
    return response.json();
}

function Sidebar() {
    const [albumName, setAlbumName] = useState("");

    const { data } = useQuery({
        queryKey: "albums",
        queryFn: () => fetchAlbums(),
    });

    const { isError, isSuccess, mutateAsync } = useMutation({
        mutationFn: (name) => {
            return fetch("/api/user/album/" + name, {
                method: "PATCH",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries("albums");
        },
    });

    function addAlbum() {
        console.log(albumName);
        if (albumName === "") {
            return;
        }
        mutateAsync(albumName);
    }

    return (
        <Grid container flexWrap="nowrap">
            <Grid container sx={{ width: "250px" }} alignContent="start">
                <Grid sx={{ width: "100%", height: "min-content" }}>
                    <Typography textAlign="center" variant="h5">
                        ALBUMS
                    </Typography>
                </Grid>
                <Grid flexDirection="column">
                    {data?.albums?.map((name) => {
                        return (
                            <Grid>
                                <Link to={`/${name === "all" ? "" : `album/${name}`}`}>
                                    {name}
                                </Link>
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid flexDirection="column">
                    <TextField
                        id="outlined-basic"
                        label="Outlined"
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onChange={(e) => setAlbumName(e.target.value)}
                    />
                    <Button variant="contained" onClick={() => addAlbum()}>
                        Add Album
                    </Button>
                </Grid>
            </Grid>
            <Outlet />
        </Grid>
    );
}

export default Sidebar;
