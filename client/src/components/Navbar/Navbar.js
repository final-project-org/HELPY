import React, { useState } from "react";
import {
    AppBar,
    Avatar,
    Button,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    withStyles,
    ListItemText,

 
} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Fade from '@material-ui/core/Fade';

import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import useStyles from "./styles";
import { useSelector } from "react-redux";
import axios from "axios";

import { SidebarData } from "./SidebarData";
import * as AiIcons from "react-icons/ai";
import "./Navbar.css";


const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
        padding: "5px",
        backgroundColor: "rgba(243, 161, 176, 0.8)",
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        margin: "auto",
        width: "150px",
    },
}))(MenuItem);

const ListItemTextCustom = withStyles((theme) => ({
    primary: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
        margin: "auto",
    },
}))(ListItemText);

const Navbar = () => {
    const classes = useStyles();
    const auth = useSelector((state) => state.auth);

    const { user, isLogged } = auth;
    // console.log(user);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const handleClose = () => {
        setAnchorEl(null);
    };
  const handleProfile = () => {
        handleClose();
    };
    const handleLogout = async () => {
        try {
            await axios.get("/api/user/logout");
            localStorage.removeItem("firstLogin");
        } catch (err) {
            console.log(err);
        }
        window.location.href = "/";
        handleClose();
    };

   

    return (

    <div className={classes.root}>
        <AppBar  position="static" className={classes.appBar}>
            <Toolbar>
            <Link  
              edge='start'
              to="/">
                    <img className={classes.image} src={logo} alt="logo" height='100'/>
                </Link>
                <Typography
                    component={Link}
                    to="/"
                    className={classes.title}
                    variant="h3"
                    noWrap
                >
                    We help with shopping
                </Typography>
                {isLogged ? (
                    <>
                <Avatar
                   className={classes.purple}
                 src={user?.avatar}
                 alt={user?.name?.first}
                 
             >
                 
             </Avatar>
             <Button 
                  className={classes.profile_button}
                 aria-controls="fade-menu" 
                 aria-haspopup="true"
                 onClick={handleClick}
             >
                  
                 {user
                     ? `${user?.name}` === "undefined"
                         ? null
                         : `${user?.name}`
                     : null}
             </Button>
      
         <StyledMenu
             id="fade-menu"
             anchorEl={anchorEl}
             keepMounted
             open={open}
             onClose={handleClose}
             TransitionComponent={Fade}
         >
             <StyledMenuItem
                 onClick={handleProfile}
                 component={Link}
                 to="/profile"
             >
                 
                  <AccountCircle  color='primary'/>
                 <ListItemTextCustom primary="PROFILE" />
             </StyledMenuItem>
             <StyledMenuItem
                 onClick={handleProfile}
                 component={Link}
                 to="/helps"
             >
                 
                 <AccessibilityNewIcon color="secondary" />
                 <ListItemTextCustom primary="HELPS" />
             </StyledMenuItem>
          
             <StyledMenuItem
                 onClick={handleLogout}
                 component={Link}
                 to="/"
             >
                 <ExitToAppIcon  color='secondary'/>
                 <ListItemTextCustom primary="LOGOUT" />
             </StyledMenuItem>
         </StyledMenu>
         </>
                ) : (
                   
                    <Button
                        component={Link}
                        to="/auth"
                        className={classes.button}
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Log in
                <AccountCircle  className={classes.icon}/>
                    </Button>
                )}
               
                    <>
                    <Button edge='end' className={classes.menuButton} color="inherit" aria-label="menu" >
                        <MenuIcon  onClick={showSidebar} fontSize='large'/>
                      
                  
                  
                    <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-items" onClick={showSidebar}>
                            <li className="navbar-toggle">
                                <Link to="#" className="menu-bars">
                                    <AiIcons.AiOutlineClose />
                                </Link>
                            </li>
                            {SidebarData.map((item, index) => {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
            
                   
                </Button>
                    </>
                
            </Toolbar>
        </AppBar>
        </div>
    );

};

export default Navbar;
