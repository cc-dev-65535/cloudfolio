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




import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Album from "./Album.jsx";
import Home from "./Home.jsx";
import Sidebar from "./Sidebar.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles/index.js';
import theme from '../theme/theme'; // Adjust the path based on your project structure


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          {/*  I think Sidebar can be outside of Routes if we want it to be displayed on all pages */}
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album" element={<Album />} />
            {/* If we have other components for other routes, they would go here */}
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export { queryClient };
export default App;

