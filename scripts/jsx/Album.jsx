import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "./App.jsx";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography, Box } from "@mui/material";
import './Album.css';

async function fetchPhotos() {
    // console.log(window.location.pathname);
    const response = await fetch("/api" + window.location.pathname);
    return response.json();
}

function Album() {
    const expandImage = (path) => {
        window.location.href = path;
    };

    const { data } = useQuery({
        queryKey: "photo",
        queryFn: () => fetchPhotos(),
    });

    return (
        <Grid container flexDirection="column">
            <Grid container alignContent="center" alignItems="center">
                <Box sx={{ width: "100%" }}>
                    <Typography variant="h1" align="center">
                        ALBUM
                    </Typography>
                </Box>
            </Grid>
            <Grid container sx={{ mt: 4 }} gap={4}>
                {data?.photos.map(({ path }) => {
                    return (
                        <Grid sx={{ width: "min-content" }} container flexDirection="column" alignContent="center">
                            <img
                                style={{
                                    border: "1px solid grey",
                                    cursor: "pointer",
                                }}
                                src={path}
                                height={100}
                                width={100}
                                onClick={() => expandImage(path)}
                            />
                            <Button variant="contained" color="error">
                                Remove
                            </Button>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
}

export default Album;
