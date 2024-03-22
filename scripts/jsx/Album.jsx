import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "./App.jsx";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography, Box } from "@mui/material";
import "./Album.css";
import Image from "./Image.jsx";
import { useLocation } from "react-router-dom";

async function fetchPhotos() {
    // console.log(window.location.pathname);
    const response = await fetch("/api" + window.location.pathname);
    return response.json();
}

function Album() {
    const expandImage = (path) => {
        window.location.href = path;
    };

    const { pathname } = useLocation();
    const albumName = pathname.split("/").at(-1);

    const { data } = useQuery({
        queryKey: ["photo", "album", window.location.pathname],
        queryFn: () => fetchPhotos(),
    });

    const {
        isError: isErrorDelete,
        isSuccess: isSuccessDelete,
        mutateAsync: mutateDeleteAsync,
    } = useMutation({
        mutationFn: (key) => {
            return fetch("/api/image/" + key, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries("photo");
        },
    });

    const deleteImage = (key) => {
        mutateDeleteAsync(key);
    };

    return (
        <Grid container flexDirection="column" sx={{ padding: 3 }} gap={2}>
            <Typography
                variant="h1"
                textAlign="center"
                fontFamily="Courgette, cursive"
                fontWeight={400}
                fontStyle="normal"
                fontSize={60}
            >
                {albumName}
            </Typography>
            <Grid container sx={{ mt: 4 }} gap={4}>
                {data?.photos.map(({ path, key, date }) => {
                    return (
                        <Image
                            key={key}
                            path={path}
                            date={date}
                            imagekey={key}
                            expandImage={expandImage}
                            deleteImage={deleteImage}
                        />
                    );
                })}
            </Grid>
        </Grid>
    );
}

export default Album;
