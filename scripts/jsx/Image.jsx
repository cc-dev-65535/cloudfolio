import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./App.jsx";
import { fetchAuthSession } from "aws-amplify/auth";

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

function Image({ date, path, imagekey, expandImage, deleteImage }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { data } = useQuery({
        queryKey: "albums",
        queryFn: () => fetchAlbums(),
    });

    const { isError, isSuccess, mutateAsync } = useMutation({
        mutationFn: async ({ imagekey, name }) => {
            const { tokens } = await fetchAuthSession();
            // console.log(tokens);
            const token = tokens?.accessToken?.toString();

            return fetch(`/api/image/${imagekey}/${name}`, {
                method: "PATCH",
                headers: {
                    Authorization: token,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries("photo");
        },
    });

    const updatePhotoAlbum = (name) => {
        mutateAsync({ imagekey, name });
    };

    return (
        <Grid
            sx={{ width: "min-content" }}
            container
            flexDirection="column"
            alignContent="center"
        >
            <img
                style={{
                    border: "1px solid grey",
                    cursor: "pointer",
                }}
                src={`/${path}`}
                onClick={() => expandImage(path)}
            />
            <Typography textAlign="center">
                {new Date(date).toLocaleString()}
            </Typography>
            <Grid container wrap="nowrap" gap={2} mt={1}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteImage(imagekey)}
                >
                    Remove
                </Button>
                <IconButton>
                    <MoreVertIcon onClick={handleClick} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    {data?.albums?.map((name) => {
                        return (
                            <MenuItem
                                key={name}
                                onClick={() => {
                                    updatePhotoAlbum(name);
                                    handleClose();
                                }}
                            >
                                {name === "all" ? "Home" : name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Grid>
        </Grid>
    );
}

export default Image;
