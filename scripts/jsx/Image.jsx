import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./App.jsx";

async function fetchAlbums() {
    const response = await fetch("/api/user/album");
    return response.json();
}

function Image({ path, imagekey, expandImage, deleteImage }) {
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
        mutationFn: ({ imagekey, name }) => {
            return fetch(`/api/image/${imagekey}/${name}`, {
                method: "PATCH",
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
                src={path}
                onClick={() => expandImage(path)}
            />
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
                                {name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Grid>
        </Grid>
    );
}

export default Image;
