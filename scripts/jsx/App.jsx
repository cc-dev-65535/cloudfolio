// import { BrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Album from "./Album.jsx";
// import Home from "./Home.jsx";
// import Sidebar from "./Sidebar.jsx";

// const queryClient = new QueryClient();

// function App() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/" element={<Sidebar />}>
//                         <Route path="/" element={<Home />} />
//                         <Route path="album/*" element={<Album />} />
//                     </Route>
//                 </Routes>
//             </BrowserRouter>
//         </QueryClientProvider>
//     );
// }

// export { queryClient };
// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Album from "./Album.jsx";
import Home from "./Home.jsx";
import Sidebar from "./Sidebar.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider } from '@mui/material/styles/index.js';
import theme from "../theme/theme";
import "./global.css";
import { ThemeProvider, AppBar, Toolbar, Button, Box } from "@mui/material";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import MainLayout from "./MainLayout.jsx";

const queryClient = new QueryClient();

const navStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="album/*" element={<Album />} />
                            <Route path="signup" element={<Signup />} />
                            <Route path="login" element={<Login />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export { queryClient };
export default App;
