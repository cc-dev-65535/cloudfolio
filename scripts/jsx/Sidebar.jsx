// import React from 'react';
// import Grid from "@mui/material/Grid";
// import { Typography } from "@mui/material";
// import { NavLink } from "react-router-dom";
// import HomeIcon from '@mui/icons-material/Home';
// import AlbumIcon from '@mui/icons-material/Album';
// import './Sidebar.css';

// function Sidebar() {
//     return (
//         <Grid className="sidebar">
//             <Typography variant="h5" align="center" className="sidebarHeader">
//                 CloudFolio
//             </Typography>
//             <div className="sidebarMenu">
//                 <NavLink to="/" className={({ isActive }) => isActive ? "activeLink" : ""}>
//                     <HomeIcon /> Home
//                 </NavLink>
//                 <NavLink to="/album" className={({ isActive }) => isActive ? "activeLink" : ""}>
//                     <AlbumIcon /> Album
//                 </NavLink>
//                 {/* Additional navigation links */}
//             </div>
//         </Grid>
//     );
// }

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <NavLink to="/" className={({ isActive }) => isActive ? "activeLink" : ""}>
//         <HomeIcon /> Home
//       </NavLink>
//       <NavLink to="/album" className={({ isActive }) => isActive ? "activeLink" : ""}>
//         <AlbumIcon /> Album
//       </NavLink>
//     </div>
//   );
// }

import { useState } from "react";
import Grid from "@mui/material/Grid";
import { queryClient } from "./App.jsx";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AlbumIcon from "@mui/icons-material/Album";
import "./Sidebar.css";

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
                                {name === "all" ? <HomeIcon /> : <AlbumIcon />}
                                {name === "all" ? "Home" : name}
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
                <Button variant="contained" onClick={() => addAlbum()}>
                    Add Album
                </Button>
            </Grid>
        </div>
    );
}

export default Sidebar;
