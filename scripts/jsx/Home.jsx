import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

function FileInput() {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
        },
    });

    const files = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

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
                <ul style={{ padding: 0 }}>{files}</ul>
            </Grid>
            {files.length ? <Button variant="contained">Upload</Button> : null}
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
