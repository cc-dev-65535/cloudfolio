import { BrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Album from "./Album.jsx";
import Home from "./Home.jsx";
import Sidebar from "./Sidebar.jsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Sidebar />}>
                        <Route path="/" element={<Home />} />
                        <Route path="album/*" element={<Album />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export { queryClient };
export default App;
