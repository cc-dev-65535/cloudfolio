import { BrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";

function Page() {
    return <h1>Hello</h1>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Page />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
