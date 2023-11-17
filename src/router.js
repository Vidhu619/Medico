import { createBrowserRouter } from "react-router-dom";
import Aboutus from "./components/Aboutus";
import App from "./App";
import Listcontainer from "./components/Listcontainer";
import  Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Logout from "./components/auth/logout";
import Addmed from "./components/curd/create";
import Viewmed from "./components/curd/view";
import Update from "./components/curd/update";
import Searchpage from "./components/curd/searchpage";
import Search from "./components/curd/search";
import TestPage from"./components/userpage";
import Ogpage from "./components/ogpage"

const router = createBrowserRouter([
    { path: 'login', element: <Login /> },               // Route to the Login component
    { path: 'app', element: <App /> },               // Route to the App component
    { path: 'aboutus', element: <Aboutus /> },       // Route to the Aboutus component
    { path: 'List', element: <Listcontainer /> },    // Route to the Listcontainer component
    { path: 'register', element: <Register /> },     // Route to the Register component
    { path: 'logout', element: <Logout /> },         // Route to the Logout component
    { path: 'addmed', element: <Addmed /> },         // Route to the Addmed component
    { path: 'view/:id', element: <Viewmed /> },      // Route to the Viewmed component with a dynamic ID parameter
    { path: 'update/:id', element: <Update /> },     // Route to the Update component with a dynamic ID parameter
    { path: 'search', element: <Searchpage /> },     // Route to the Searchpage component
    { path: 'medsearch', element: <Search /> },      // Route to the Search component
    { path: 'user',element:<TestPage />},            // Route to the homes component
    { path: '/',element:<Ogpage />},            // Route to the homes component
]);

export default router;
