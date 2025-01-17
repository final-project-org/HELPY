import React, { useState } from "react";
import { Button, Paper, Grid, Typography, Container } from "@material-ui/core";

import "./auth.css";

import useStyles from "./styles";
import logo1 from "../../images/logo1.png";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { dispatchLogin } from "../../actions/authActions";

import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

import {
    showErrMsg,
    showSuccessMsg,
} from "../../utils/notification/Notification";

import {
    isEmail,
    isEmpty,
    isLength,
    isMatch,
} from "../../utils/validation/Validation";

import axios from "axios";

import ConfirmModal from "../../utils/confirmation/ConfirmModal";

const initialState = {
    first: "",
    last: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    zipCode: "",
    streetName: "",
    box: "",
    err: "",
    success: "",
};

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();
    const [confirm, setConfirm] = useState();

    const googleId = process.env.REACT_APP_GOOGLE_ID;
    const facebookId = process.env.REACT_APP_FACEBOOK_ID;

    const {
        first,
        last,
        email,
        password,
        confirmPassword,
        phone,
        city,
        zipCode,
        streetName,
        box,
        err,
        success,
    } = formData;

    const showPasswordHandler = () =>
        setShowPassword((prevShowPassword) => !prevShowPassword); //togling off/on

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegister) {
            if (
                isEmpty(first) ||
                isEmpty(last) ||
                isEmpty(email) ||
                isEmpty(password) ||
                isEmpty(confirmPassword)
            ) {
                return setFormData({
                    ...formData,
                    err: "Please fill in all fields.",
                    success: "",
                });
            }
            if (!isEmail(email)) {
                return setFormData({
                    ...formData,
                    err: "Invalid email.",
                    success: "",
                });
            }
            if (isLength(password)) {
                return setFormData({
                    ...formData,
                    err: "Password must be at least 6 characters.",
                    success: "",
                });
            }
            if (!isMatch(password, confirmPassword)) {
                return setFormData({
                    ...formData,
                    err: "Password did not match.",
                    success: "",
                });
            }

            try {
                const res = await axios.post("/api/user/register", {
                    first,
                    last,
                    email,
                    password,
                    phone,
                    streetName,
                    city,
                    box,
                    zipCode,
                });

                setFormData({ ...formData, err: "", success: res.data.msg });

                // localStorage.setItem('firstLogin', true);
                setConfirm({
                    title: "Registration successful!",
                    message:
                        "Register Success! Please activate your email to start. ",
                });
            } catch (err) {
                err.response.data.msg &&
                    setFormData({
                        ...formData,
                        err: err.response.data.msg,
                        success: "",
                    });
            }
        } else {
            try {
                const res = await axios.post("/api/user/login", {
                    email,
                    password,
                });

                setFormData({ ...formData, err: "", success: res.data.msg });

                localStorage.setItem("firstLogin", true);

                dispatch(dispatchLogin());
                history.push("/helps");
            } catch (err) {
                err.response?.data.msg &&
                    setFormData({
                        ...formData,
                        err: err.response.data.msg,
                        success: "",
                    });
            }
        }
    };

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsRegister((prevIsRegister) => !prevIsRegister);
        setShowPassword(false);
    };

    const responseGoogle = async (response) => {
        try {
            const res = await axios.post("/api/user/google_login", {
                tokenId: response.tokenId,
            });

            setFormData({ ...formData, error: "", success: res.data.msg });
            localStorage.setItem("firstLogin", true);

            dispatch(dispatchLogin());
            history.push("/helps");
        } catch (err) {
            err.response.data.msg &&
                setFormData({
                    ...formData,
                    err: err.response.data.msg,
                    success: "",
                });
        }
    };

    const responseFacebook = async (response) => {
        try {
            const { accessToken, userID } = response;
            const res = await axios.post("/api/user/facebook_login", {
                accessToken,
                userID,
            });

            setFormData({ ...formData, error: "", success: res.data.msg });
            localStorage.setItem("firstLogin", true);

            dispatch(dispatchLogin());
            history.push("/helps");
        } catch (err) {
            err.response.data.msg &&
                setFormData({
                    ...formData,
                    err: err.response.data.msg,
                    success: "",
                });
        }
    };

    const failureGoogle = (response) => {
        console.log(response);
    };

    const handleConfirm = () => {
        setConfirm(null);
        window.location.reload();
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper}>
                <img src={logo1} alt="logo1" height="50" />
                <Typography variant="h5">
                    {isRegister ? "Sign Up" : "Log In"}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    {err && showErrMsg(err)}
                    {success && showSuccessMsg(success)}
                    <Grid container spacing={2}>
                        {isRegister && (
                            <>
                                <Input
                                    name="first"
                                    label="First Name"
                                    changeHandler={changeHandler}
                                    half
                                    required
                                />
                                <Input
                                    name="last"
                                    label="Last Name"
                                    changeHandler={changeHandler}
                                    half
                                    required
                                />
                            </>
                        )}
                        <Input
                            name="email"
                            label="Email Address"
                            changeHandler={changeHandler}
                            type="email"
                            required
                        />
                        <Input
                            name="password"
                            label="Password"
                            changeHandler={changeHandler}
                            type={showPassword ? "text" : "password"}
                            showPasswordHandler={showPasswordHandler}
                            required
                        />
                        {confirm && (
                            <ConfirmModal
                                title={confirm.title}
                                message={confirm.message}
                                onConfirm={handleConfirm}
                            />
                        )}
                        {isRegister && (
                            <>
                                <Input
                                    name="confirmPassword"
                                    label="Repeat Password"
                                    changeHandler={changeHandler}
                                    type={showPassword ? "text" : "password"}
                                    showPasswordHandler={showPasswordHandler}
                                    required
                                />
                                <Input
                                    name="phone"
                                    label="Phone Number"
                                    changeHandler={changeHandler}
                                    type="phoneNumber"
                                    required
                                />
                                <Input
                                    name="city"
                                    label="City"
                                    changeHandler={changeHandler}
                                    type="city"
                                    half
                                />
                                <Input
                                    name="zipCode"
                                    label="Zip Code"
                                    changeHandler={changeHandler}
                                    type="zipCode"
                                    half
                                />
                                <Input
                                    name="streetName"
                                    label="Street and Namber"
                                    changeHandler={changeHandler}
                                    type="streetName"
                                    half
                                />
                                <Input
                                    name="box"
                                    label="Box"
                                    changeHandler={changeHandler}
                                    type="box"
                                    half
                                />
                            </>
                        )}
                        {!isRegister && (
                            <Link
                                to="/forgot_password"
                                className={classes.forgot_password}
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {isRegister ? "Register" : "Log In"}
                    </Button>

                    <Grid container justify="center">
                        <Button
                            className={classes.switch}
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={switchMode}
                        >
                            {isRegister
                                ? "Already have an account? Log In"
                                : "Don't have an account? Sign Up"}
                        </Button>
                        <div className="social">
                            <GoogleLogin
                                clientId={googleId}
                                buttonText="Login with Google"
                                onSuccess={responseGoogle}
                                onFailure={failureGoogle}
                                cookiePolicy={"single_host_origin"}
                            />
                            <FacebookLogin
                                appId={facebookId}
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook}
                            />
                        </div>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Auth;
