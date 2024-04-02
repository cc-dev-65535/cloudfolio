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
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            //  Amazon Cognito User Pool ID
            userPoolId: "us-west-2_jERIkWzhR",
            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolClientId: "5qatetkqk6qpcimn3q2h5ah58u",
            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
            // OPTIONAL - Set to true to use your identity pool's unauthenticated role when user is not logged in
            // allowGuestAccess: true
            // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
            // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
            // signUpVerificationMethod: 'code', // 'code' | 'link'
            //   loginWith: {
            //     // OPTIONAL - Hosted UI configuration
            //     oauth: {
            //       domain: 'your_cognito_domain',
            //       scopes: [
            //         'phone',
            //         'email',
            //         'profile',
            //         'openid',
            //         'aws.cognito.signin.user.admin'
            //       ],
            //       redirectSignIn: ['http://localhost:3000/'],
            //       redirectSignOut: ['http://localhost:3000/'],
            //       responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
            //     }
            //   }
        },
    },
});

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
                <Authenticator signUpAttributes={["email"]}>
                    {({ signOut, user }) => (
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
                    )}
                </Authenticator>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export { queryClient };
export default App;
