import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "./App.jsx";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Image from "./Image.jsx";
import "./Home.css";

function createPostData(file) {
    const data = new FormData();
    data.append("image", file);
    return data;
}

function FileInput() {
    const [uploadFiles, setUploadFiles] = useState([]);

    const { isError, isSuccess, mutateAsync } = useMutation({
        mutationFn: (file) => {
            return fetch("/api/image", {
                method: "POST",
                // headers: {
                //     "Content-type": "multipart/form-data",
                // },
                body: createPostData(file),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries("photo");
            setUploadFiles([]);
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
        },
        onDrop: (acceptedFiles) => {
            setUploadFiles(acceptedFiles);
        },
    });

    function sendImage() {
        mutateAsync(uploadFiles[0]);
    }

    return (
        <Grid
            container
            flexDirection="column"
            alignContent="center"
            alignItems="center"
        >
            <Typography variant="h1">CLOUDFOLIO</Typography>
            <Grid
                {...getRootProps()}
                container
                sx={{
                    width: "100%",
                    padding: "40px",
                    border: "2px dashed #EEEEEE",
                }}
                flexDirection="column"
                alignContent="center"
                alignItems="center"
            >
                <input {...getInputProps()} />
                <Button item variant="contained">
                    Drag files here or click to select
                </Button>
            </Grid>
            <Grid
                container
                flexDirection="column"
                alignContent="center"
                alignItems="center"
            >
                <h4 style={{ marginBottom: 0 }}>Files To Upload:</h4>
                <ul style={{ padding: 0 }}>
                    {uploadFiles.map((file) => (
                        <li key={file.path}>
                            {file.path} - {file.size} bytes
                        </li>
                    ))}
                </ul>
            </Grid>
            {uploadFiles.length ? (
                <Button variant="contained" onClick={sendImage}>
                    Upload
                </Button>
            ) : null}
        </Grid>
    );
}

async function fetchPhotos() {
    const response = await fetch("/api/image");
    return response.json();
}

function Home() {
    const expandImage = (path) => {
        window.location.href = path;
    };

    const { data } = useQuery({
        queryKey: "photo",
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
        <Grid container flexDirection="column" sx={{ padding: 3 }}>
            <FileInput />
            <Grid container sx={{ mt: 4 }} gap={4}>
                {data?.photos?.map(({ path, key }) => {
                    return (
                        <Image
                            key={key}
                            path={path}
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

export default Home;
