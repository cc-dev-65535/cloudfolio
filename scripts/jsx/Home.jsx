import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

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

function Home() {
    return (
        <Grid container flexDirection="column">
            <FileInput />
            <Grid container sx={{ mt: 4 }}>
                PHOTOS HERE
            </Grid>
        </Grid>
    );
}

export default Home;
