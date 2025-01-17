import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import logo1 from "../../images/logo1.png";
import useStyles from "./styles";
import ConfirmModal from "../../utils/confirmation/ConfirmModal";
import { createHelp, updateHelp } from "../../actions/helpsActions";


const initialValues = {
    helpTitle: "",
    description: "",
    availableSlot: "2021-05-24T17:30",
};

export const Form = ({
    wantsToHelp,
    setWantsToHelp,
    currentId,
    setCurrentId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const help = useSelector((state) => state.help);
    const [confirm, setConfirm] = useState();
    // console.log(help)
    const [cardData, setCardData] = useState(initialValues);

    const changeHandler = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(cardData)
        if (currentId) {
            setConfirm({
                title: "Your help is updated!",
                message: "Our users will contact you soon.",
            });
            dispatch(
                updateHelp(
                    currentId,
                    {
                        ...cardData,
                    },
                    token
                )
            );
            setCurrentId(false);
        } else {
            setConfirm({
                title: "Your help is created!",
                message: "Our users will contact you soon. ",
            });
            dispatch(
                createHelp(
                    {
                        ...cardData,
                        wantsToHelp,
                    },
                    token
                )
            );
        }

        handleClear();
    };

    const handleClear = () => {
        setCardData(initialValues);
        setCurrentId(false);
    };
    const switchMode = () => {
        setWantsToHelp((prevWantsToHelp) => !prevWantsToHelp);
    };

    const handleConfirm = () => {
        setConfirm(null);
    };

    useEffect(() => {
       if(currentId){
        console.log('current id var')
        setCardData({ ...cardData, helpTitle: help.helpTitle,
        description: help.description });
    }
    },[currentId, help])
    
    
    
    return (
        <Paper className={classes.paper} >
            <form
                autoComplete="off"
                noValidate
                className={`${classes.root} ${classes.form}`}
                onSubmit={handleSubmit}
            >
                {confirm && (
                    <ConfirmModal
                        title={confirm.title}
                        message={confirm.message}
                        onConfirm={handleConfirm}
                    />
                )}
                <div align="center">
                    <img src={logo1} alt="logo1" height="50" />
                    <Typography variant="h5">
                        {currentId ? "Update" : "Create"}
                    </Typography>
                    <Typography variant="h5">
                        {wantsToHelp ? "Desire For Help" : "Request For Help"}
                    </Typography>
                </div>
                {!currentId && (
                    <Button
                        className={classes.switch}
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={switchMode}
                    >
                        {wantsToHelp ? " I Need a Help" : "I Want to Help "}
                    </Button>
                )}

                {wantsToHelp && (
                    <>
                        <TextField
                            className={classes.input}
                            name="helpTitle"
                            label="Title"
                            variant="outlined"
                            id="name"
                            value={cardData.helpTitle}
                            fullWidth
                            inputProps={{ maxLength: 13 }}
                            changeHandler={changeHandler}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    helpTitle: e.target.value,
                                })
                            }
                        />

                        <TextField
                            className={classes.input}
                            name="description"
                            label="Describe how you can help?"
                            variant="outlined"
                            value={cardData.description}
                            fullWidth
                            multiline
                            rows={2}
                            inputProps={{ maxLength: 200 }}
                            changeHandler={changeHandler}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    description: e.target.value,
                                })
                            }
                        />

                        <TextField
                            className={classes.input}
                            name="dateAndTimeChoice"
                            id="dateAndTimeChoice"
                            label="Choose Date and Time "
                            type="datetime-local"
                            variant="outlined"
                            defaultValue="2021-05-24T17:30"
                            fullWidth
                            // className={classes.textField}
                            changeHandler={changeHandler}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    dateAndTimeChoice: e.target.value,
                                })
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                )}
                {!wantsToHelp && (
                    <>
                        <TextField
                            className={classes.input}
                            name="helpTitle"
                            label="Title"
                            variant="outlined"
                            id="name"
                            value={cardData.helpTitle}
                            fullWidth
                            inputProps={{ maxLength: 13 }}
                            changeHandler={changeHandler}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    helpTitle: e.target.value,
                                })
                            }
                        />

                        <TextField
                            className={classes.input}
                            name="description"
                            label="Describe what do you need?"
                            variant="outlined"
                            value={cardData.description}
                            fullWidth
                            multiline
                            rows={2}
                            changeHandler={changeHandler}
                            inputProps={{ maxLength: 200 }}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    description: e.target.value,
                                })
                            }
                        />

                        <TextField
                            className={classes.input}
                            name="dateAndTimeChoice"
                            id="dateAndTimeChoice"
                            label="Choose Date and Time "
                            type="datetime-local"
                            variant="outlined"
                            defaultValue="2021-05-24T17:30"
                            fullWidth
                            // className={classes.textField}
                            changeHandler={changeHandler}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    dateAndTimeChoice: e.target.value,
                                })
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                )}
                <Button
                    className={classes.buttonSubmit}
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                >
                    Submit
                </Button>
                <Button
                    className={classes.buttonClear}
                    variant="contained"
                    color="#5B5B61"
                    onClick={handleClear}
                    fullWidth
                >
                    Clear
                </Button>
            </form>
        </Paper>
    );
};

export default Form;
