import { useState } from "react";
import Grid from "@mui/material/Grid";
import { queryClient } from "./App.jsx";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AlbumIcon from "@mui/icons-material/Album";
import { fetchAuthSession } from "aws-amplify/auth";
import "./Sidebar.css";

async function fetchAlbums() {
    const { tokens } = await fetchAuthSession();
    // console.log(tokens);
    const token = tokens?.accessToken?.toString();

    const response = await fetch("/api/user/album", {
        headers: {
            Authorization: token,
        },
    });
    return response.json();
}

function Sidebar() {
    const [albumName, setAlbumName] = useState("");

    const { data } = useQuery({
        queryKey: "albums",
        queryFn: () => fetchAlbums(),
    });

    const { isError, isSuccess, mutateAsync } = useMutation({
        mutationFn: async (name) => {
            const { tokens } = await fetchAuthSession();
            // console.log(tokens);
            const token = tokens?.accessToken?.toString();

            return fetch("/api/user/album/" + name, {
                method: "PATCH",
                headers: {
                    Authorization: token,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries("albums");
            setAlbumName("");
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
        <div className="sidebar">
            {/* <Grid sx={{ width: "100%", height: "min-content" }}>
                    <Typography textAlign="center" variant="h5">
                        ALBUMS
                    </Typography>
                </Grid> */}
            <Grid flexDirection="column">
                {data?.albums?.map((name) => {
                    return (
                        <Grid key={name}>
                            <NavLink
                                to={`/${name === "all" ? "" : `album/${name}`}`}
                                className={({ isActive }) =>
                                    isActive ? "activeLink" : ""
                                }
                            >
                                <Grid
                                    container
                                    alignContent="center"
                                    alignItems="center"
                                    gap={1}
                                >
                                    {name === "all" ? (
                                        <HomeIcon />
                                    ) : (
                                        <AlbumIcon />
                                    )}
                                    {name === "all" ? "Home" : name}
                                </Grid>
                            </NavLink>
                        </Grid>
                    );
                })}
            </Grid>
            <Grid flexDirection="column">
                <TextField
                    label="Album Name"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                />
                <Button
                    sx={{ mt: 1 }}
                    variant="contained"
                    onClick={() => addAlbum()}
                >
                    Add Album
                </Button>
            </Grid>
        </div>
    );
}

export default Sidebar;
