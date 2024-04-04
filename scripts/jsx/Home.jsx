import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
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
        mutationFn: async (file) => {
            const { tokens } = await fetchAuthSession();
            // console.log(tokens);
            const token = tokens?.accessToken?.toString();

            return fetch("/api/image", {
                method: "POST",
                // headers: {
                //     "Content-type": "multipart/form-data",
                // },
                headers: {
                    Authorization: token,
                },
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
    const { tokens } = await fetchAuthSession();
    // console.log(tokens);
    const token = tokens?.accessToken?.toString();
    // console.log(token);
    const response = await fetch("/api/image", {
        headers: {
            Authorization: token,
        },
    });
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
        mutationFn: async (key) => {
            const { tokens } = await fetchAuthSession();
            // console.log(tokens);
            const token = tokens?.accessToken?.toString();

            return fetch("/api/image/" + key, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
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
                fontFamily="Lobster, cursive"
                fontWeight={400}
                fontStyle="normal"
                fontSize={100}
            >
                Cloudfolio
            </Typography>
            <FileInput />
            <Grid container sx={{ mt: 4 }} gap={4}>
                {data?.photos?.map(({ path, key, date }) => {
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

export default Home;
