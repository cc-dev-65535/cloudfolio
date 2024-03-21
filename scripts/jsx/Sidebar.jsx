// import Grid from "@mui/material/Grid";
// import { Typography, Box } from "@mui/material";
// import { Outlet, Link } from "react-router-dom";
// import './Sidebar.css';

// function Sidebar() {
//     return (
//         <Grid container flexWrap="nowrap">
//             <Grid container sx={{ width: "250px" }} alignContent="start">
//                 <Grid sx={{ width: "100%", height: 'min-content' }}>
//                     <Typography textAlign="center" variant="h5">
//                         SIDEBAR
//                     </Typography>
//                 </Grid>
//                 <Grid flexDirection="column">
//                     <Grid>
//                         <Link to="/">all</Link>
//                     </Grid>
//                     <Grid>
//                         <Link to="/album/a">a</Link>
//                     </Grid>
//                     <Grid>
//                         <Link to="/album/b">b</Link>
//                     </Grid>
//                 </Grid>
//             </Grid>
//             <Outlet />
//         </Grid>
//     );
// }

// export default Sidebar;



import React from 'react';
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AlbumIcon from '@mui/icons-material/Album';
import './Sidebar.css';

// function Sidebar() {
//     return (
//         <Grid className="sidebar">
//             <Typography variant="h5" align="center" className="sidebarHeader">
//                 CloudFolio
//             </Typography>
//             <div className="sidebarMenu">
//                 <NavLink to="/" className={({ isActive }) => isActive ? "activeLink" : ""}>
//                     <HomeIcon /> Home
//                 </NavLink>
//                 <NavLink to="/album" className={({ isActive }) => isActive ? "activeLink" : ""}>
//                     <AlbumIcon /> Album
//                 </NavLink>
//                 {/* Additional navigation links */}
//             </div>
//         </Grid>
//     );
// }


function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => isActive ? "activeLink" : ""}>
        <HomeIcon /> Home
      </NavLink>
      <NavLink to="/album" className={({ isActive }) => isActive ? "activeLink" : ""}>
        <AlbumIcon /> Album
      </NavLink>
    </div>
  );
}

export default Sidebar;

