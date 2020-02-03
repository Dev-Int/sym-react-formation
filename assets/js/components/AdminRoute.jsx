import React, { useContext } from 'react';
import AdminContext from "../contexts/AdminContext";
import {Redirect, Route} from "react-router-dom";

const AdminRoute = ({path, component}) => {
    const { isAdmin } = useContext(AdminContext);
    return isAdmin ? (
        <Route path={path} component={component} />
    ) : (
        <Redirect to={"/"} />
    );
};

export default AdminRoute;