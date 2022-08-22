import * as React from "react";
import {
    Grid,
    Card,
    Box,
    Button,
    Popover,
    Checkbox,
    Dialog,
    DialogTitle,
    Snackbar,
    Alert,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FaTimes } from "react-icons/fa";
import {
    getBeastMOONLIGHTAllowance,
    setBeastMOONLIGHTApprove,
    getWarriorMOONLIGHTAllowance,
    setWarriorMOONLIGHTApprove,
    mintBeast,
    mintWarrior,
    getMOONLIGHTAmountToMintBeast,
    getMOONLIGHTAmountToMintWarrior,
} from "../../hooks/contractFunction";
import { useWeb3React } from "@web3-react/core";
import {
    useMOONLIGHT,
    useBeast,
    useWarrior,
    useWeb3,
} from "../../hooks/useContract";
import { useNavigate } from "react-router-dom";
import Slide, { SlideProps } from "@mui/material/Slide";
import { useDispatch } from "react-redux";
import { setReloadStatus } from "../../actions/contractActions";
import { getTranslation } from "../../utils/translation";
import { makeStyles } from "@mui/styles";
import { NavLink } from "react-router-dom";

import CommonBtn from "../../component/Buttons/CommonBtn";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles({
    legionBtn: {
        background:
            "linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)",
        transition: ".4s all",
        // '&:hover': {
        //     background: 'linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)',
        //     transition: '.4s all',
        // },
        color: "white !important",
        textShadow:
            "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    },
    root: {
        display: "flex",
        flexDirection: "column",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        minHeight: "180px",
        height: "100%",
    },
    achievementBtn: {
        background: "red",
        padding: 10,
        borderRadius: 5,
        cursor: "pointer",
        color: "black",
        animation: `$Flash linear 1s infinite`,
    },
    "@keyframes Flash": {
        "0%": {
            background: "#19aa6f",
            boxShadow: "0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset",
        },
        "50%": {
            background: "#24f39f",
            boxShadow: "0 0 4px 4px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset",
        },
        "100%": {
            background: "#19aa6f",
            boxShadow: "0 0 1px 1px #a7a2a2, 0px 0px 1px 2px #a7a2a2 inset",
        },
    },
});

const TakeAction = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classes = useStyles();

    const [warriorMLTAmountPer, setWarriorMLTAmountPer] = React.useState({
        b1: {
            amount: 0,
            per: "0",
        },
        b10: {
            amount: 0,
            per: "0",
        },
        b50: {
            amount: 0,
            per: "0",
        },
        b200: {
            amount: 0,
            per: "0",
        },
        b500: {
            amount: 0,
            per: "0",
        },
    });

    const [beastMLTAmountPer, setBeastMLTAmountPer] = React.useState({
        b1: {
            amount: 0,
            per: "0",
        },
        b50: {
            amount: 0,
            per: "0",
        },
        b10: {
            amount: 0,
            per: "0",
        },
        b200: {
            amount: 0,
            per: "0",
        },
        b500: {
            amount: 0,
            per: "0",
        },
    });

    //Popover for Summon Beast
    const [anchorElSummonBeast, setAnchorElSummonBeast] =
        React.useState<HTMLElement | null>(null);
    const handlePopoverOpenSummonBeast = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorElSummonBeast(event.currentTarget);
    };
    const handlePopoverCloseSummonBeast = () => {
        setAnchorElSummonBeast(null);
    };
    const openSummonBeast = Boolean(anchorElSummonBeast);

    //Popover for Summon Warrior
    const [anchorElSummonWarrior, setAnchorElSummonWarrior] =
        React.useState<HTMLElement | null>(null);
    const handlePopoverOpenSummonWarrior = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorElSummonWarrior(event.currentTarget);
    };
    const handlePopoverCloseSummonWarrior = () => {
        setAnchorElSummonWarrior(null);
    };
    const openSummonWarrior = Boolean(anchorElSummonWarrior);

    //Account
    const { account } = useWeb3React();

    const beastContract = useBeast();
    const warriorContract = useWarrior();
    const MOONLIGHTContract = useMOONLIGHT();
    const web3 = useWeb3();

    //Mint Beast with quantity
    const handleBeastMint = async (
        amount: Number,
        Transition: React.ComponentType<TransitionProps>
    ) => {
        handlePopoverCloseSummonBeast();
        const allowance = await getBeastMOONLIGHTAllowance(
            web3,
            MOONLIGHTContract,
            account
        );
        if (allowance === "0") {
            await setBeastMOONLIGHTApprove(web3, MOONLIGHTContract, account);
        }
        await mintBeast(web3, beastContract, account, amount);

        setTransition(() => Transition);
        setSnackBarMessage(getTranslation("summonBeastSuccessful"));
        setSnackBarNavigation("/beasts");
        setOpenSnackBar(true);
        dispatch(
            setReloadStatus({
                reloadContractStatus: new Date(),
            })
        );
    };

    //Mint Warriors with quantity
    const handleWarriorMint = async (
        amount: Number,
        Transition: React.ComponentType<TransitionProps>
    ) => {
        handlePopoverCloseSummonWarrior();
        const allowance = await getWarriorMOONLIGHTAllowance(
            web3,
            MOONLIGHTContract,
            account
        );
        if (allowance === "0") {
            await setWarriorMOONLIGHTApprove(
                web3,
                MOONLIGHTContract,
                account
            );
        }
        await mintWarrior(web3, warriorContract, account, amount);

        setTransition(() => Transition);
        setSnackBarMessage(getTranslation("summonWarriorSuccessful"));
        setSnackBarNavigation("/warriors");
        setOpenSnackBar(true);
        dispatch(
            setReloadStatus({
                reloadContractStatus: new Date(),
            })
        );
    };

    //SnackBar
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    const [snackBarNavigation, setSnackBarNavigation] = React.useState("");
    const [transition, setTransition] = React.useState<
        React.ComponentType<TransitionProps> | undefined
    >(undefined);

    const getMLTAmountToMintWarrior = async () => {
        var MLT_amount_1 = 0;
        var MLT_amount_10 = 0;
        var MLT_amount_50 = 0;
        var MLT_amount_200 = 0;
        var MLT_amount_500 = 0;

        var MLT_per_1 = "0";
        var MLT_per_10 = "0";
        var MLT_per_50 = "0";
        var MLT_per_200 = "0";
        var MLT_per_500 = "0";

        try {
            MLT_amount_1 = await getMOONLIGHTAmountToMintWarrior(
                web3,
                warriorContract,
                1
            );
            MLT_amount_10 = await getMOONLIGHTAmountToMintWarrior(
                web3,
                warriorContract,
                10
            );
            MLT_amount_50 = await getMOONLIGHTAmountToMintWarrior(
                web3,
                warriorContract,
                50
            );
            MLT_amount_200 = await getMOONLIGHTAmountToMintWarrior(
                web3,
                warriorContract,
                200
            );
            MLT_amount_500 = await getMOONLIGHTAmountToMintWarrior(
                web3,
                warriorContract,
                500
            );
            MLT_per_1 = ((1 - MLT_amount_1 / MLT_amount_1) * 100).toFixed(0);
            MLT_per_10 = (
                (1 - MLT_amount_10 / (MLT_amount_1 * 10)) *
                100
            ).toFixed(0);
            MLT_per_50 = (
                (1 - MLT_amount_50 / (MLT_amount_1 * 50)) *
                100
            ).toFixed(0);
            MLT_per_200 = (
                (1 - MLT_amount_200 / (MLT_amount_1 * 200)) *
                100
            ).toFixed(0);
            MLT_per_500 = (
                (1 - MLT_amount_500 / (MLT_amount_1 * 500)) *
                100
            ).toFixed(0);
            var amount_per = {
                b1: {
                    amount: MLT_amount_1,
                    per: MLT_per_1,
                },
                b10: {
                    amount: MLT_amount_10,
                    per: MLT_per_10,
                },
                b50: {
                    amount: MLT_amount_50,
                    per: MLT_per_50,
                },
                b200: {
                    amount: MLT_amount_200,
                    per: MLT_per_200,
                },
                b500: {
                    amount: MLT_amount_500,
                    per: MLT_per_500,
                },
            };
            setWarriorMLTAmountPer(amount_per);
        } catch (error) {
            console.log(error);
        }

        return MLT_amount_1;
    };

    const getMLTAmountToMintBeast = async () => {
        var MLT_amount_1 = 0;
        var MLT_amount_10 = 0;
        var MLT_amount_50 = 0;
        var MLT_amount_200 = 0;
        var MLT_amount_500 = 0;

        var MLT_per_1 = "0";
        var MLT_per_10 = "0";
        var MLT_per_50 = "0";
        var MLT_per_200 = "0";
        var MLT_per_500 = "0";

        try {
            MLT_amount_1 = await getMOONLIGHTAmountToMintBeast(
                web3,
                beastContract,
                1
            );
            MLT_amount_10 = await getMOONLIGHTAmountToMintBeast(
                web3,
                beastContract,
                10
            );
            MLT_amount_50 = await getMOONLIGHTAmountToMintBeast(
                web3,
                beastContract,
                50
            );
            MLT_amount_200 = await getMOONLIGHTAmountToMintBeast(
                web3,
                beastContract,
                200
            );
            MLT_amount_500 = await getMOONLIGHTAmountToMintBeast(
                web3,
                beastContract,
                500
            );
            MLT_per_1 = ((1 - MLT_amount_1 / MLT_amount_1) * 100).toFixed(0);
            MLT_per_10 = (
                (1 - MLT_amount_10 / (MLT_amount_1 * 10)) *
                100
            ).toFixed(0);
            MLT_per_50 = (
                (1 - MLT_amount_50 / (MLT_amount_1 * 50)) *
                100
            ).toFixed(0);
            MLT_per_200 = (
                (1 - MLT_amount_200 / (MLT_amount_1 * 200)) *
                100
            ).toFixed(0);
            MLT_per_500 = (
                (1 - MLT_amount_500 / (MLT_amount_1 * 500)) *
                100
            ).toFixed(0);
            var amount_per = {
                b1: {
                    amount: MLT_amount_1,
                    per: MLT_per_1,
                },
                b50: {
                    amount: MLT_amount_50,
                    per: MLT_per_50,
                },
                b10: {
                    amount: MLT_amount_10,
                    per: MLT_per_10,
                },
                b200: {
                    amount: MLT_amount_200,
                    per: MLT_per_200,
                },
                b500: {
                    amount: MLT_amount_500,
                    per: MLT_per_500,
                },
            };
            setBeastMLTAmountPer(amount_per);
        } catch (error) {
            console.log(error);
        }

        return MLT_amount_1;
    };

    React.useEffect(() => {
        getMLTAmountToMintWarrior();
        getMLTAmountToMintBeast();
    }, []);

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "180px",
                height: "100%",
                background: "#16161699",
            }}
        >
            <Snackbar
                open={openSnackBar}
                TransitionComponent={transition}
                autoHideDuration={6000}
                onClose={() => setOpenSnackBar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                key={transition ? transition.name : ""}
            >
                <Alert
                    onClose={() => setOpenSnackBar(false)}
                    variant="filled"
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(snackBarNavigation)}
                    >
                        {snackBarMessage}
                    </Box>
                </Alert>
            </Snackbar>
            <Box sx={{ p: 4, justifyContent: "center" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        borderBottom: "1px solid #fff",
                        marginBottom: 3,
                    }}
                >
                    TAKE ACTION
                </Typography>
                <Box>
                    <Grid container spacing={{ xs: 2, sm: 2, md: 1, lg: 2 }}>
                        <Grid item xs={6} md={12} lg={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{ textAlign: "center", width: "100%" }}
                                >
                                    <CommonBtn
                                        aria-describedby={"summon-warrior-id"}
                                        onClick={handlePopoverOpenSummonWarrior}
                                        sx={{
                                            fontWeight: "bold",
                                            wordBreak: 'break-word',
                                            fontSize: 14,
                                            width: "100%",
                                            marginBottom: 1,
                                        }}
                                    >
                                        {getTranslation("summonWarrior")}
                                    </CommonBtn>
                                    <Popover
                                        id={"summon-warrior-id"}
                                        open={openSummonWarrior}
                                        anchorEl={anchorElSummonWarrior}
                                        onClose={
                                            handlePopoverCloseSummonWarrior
                                        }
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "center",
                                            horizontal: "right",
                                        }}
                                    >
                                        <Box sx={{ display: "flex" }}>
                                            <Box
                                                sx={{
                                                    marginLeft: "auto",
                                                    wordBreak: 'break-word',
                                                    cursor: "pointer",
                                                    marginRight: 1,
                                                    marginTop: 1,
                                                }}
                                            >
                                                <FaTimes
                                                    onClick={
                                                        handlePopoverCloseSummonWarrior
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                        <DialogTitle>
                                            {getTranslation(
                                                "takeActionSummonWarriorQuantity"
                                            )}
                                        </DialogTitle>
                                        <Box
                                            sx={{
                                                padding: 3,
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <CommonBtn
                                                onClick={() =>
                                                    handleWarriorMint(
                                                        1,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                1 (
                                                {warriorMLTAmountPer.b1?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleWarriorMint(
                                                        10,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                10 (
                                                {"-" +
                                                    warriorMLTAmountPer.b10.per +
                                                    "%" +
                                                    " | " +
                                                    warriorMLTAmountPer.b10
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleWarriorMint(
                                                        50,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                50 (
                                                {"-" +
                                                    warriorMLTAmountPer.b50.per +
                                                    "%" +
                                                    " | " +
                                                    warriorMLTAmountPer.b50
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleWarriorMint(
                                                        200,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                200 (
                                                {"-" +
                                                    warriorMLTAmountPer.b200.per +
                                                    "%" +
                                                    " | " +
                                                    warriorMLTAmountPer.b200
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleWarriorMint(
                                                        500,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                500 (
                                                {"-" +
                                                    warriorMLTAmountPer.b500
                                                        .per +
                                                    "%" +
                                                    " | " +
                                                    warriorMLTAmountPer.b500
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                        </Box>
                                    </Popover>
                                    <CommonBtn
                                        onClick={handlePopoverOpenSummonBeast}
                                        aria-describedby={"summon-beast-id"}
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            wordBreak: 'break-word',
                                            width: "100%",
                                            marginBottom: 1,
                                        }}
                                    >
                                        {getTranslation("summonBeast")}
                                    </CommonBtn>
                                    <Popover
                                        id={"summon-beast-id"}
                                        open={openSummonBeast}
                                        anchorEl={anchorElSummonBeast}
                                        onClose={handlePopoverCloseSummonBeast}
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "center",
                                            horizontal: "right",
                                        }}
                                    >
                                        <Box sx={{ display: "flex" }}>
                                            <Box
                                                sx={{
                                                    marginLeft: "auto",
                                                    cursor: "pointer",
                                                    marginRight: 1,
                                                    marginTop: 1,
                                                }}
                                            >
                                                <FaTimes
                                                    onClick={
                                                        handlePopoverCloseSummonBeast
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                        <DialogTitle>
                                            {getTranslation(
                                                "takeActionSummonBeastQuantity"
                                            )}
                                        </DialogTitle>
                                        <Box
                                            sx={{
                                                padding: 3,
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <CommonBtn
                                                onClick={() =>
                                                    handleBeastMint(
                                                        1,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                1 (
                                                {beastMLTAmountPer.b1?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleBeastMint(
                                                        10,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                10 (
                                                {"-" +
                                                    beastMLTAmountPer.b10
                                                        .per +
                                                    "%" +
                                                    " | " +
                                                    beastMLTAmountPer.b10
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleBeastMint(
                                                        50,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                50 (
                                                {"-" +
                                                    beastMLTAmountPer.b50.per +
                                                    "%" +
                                                    " | " +
                                                    beastMLTAmountPer.b50
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleBeastMint(
                                                        200,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                200 (
                                                {"-" +
                                                    beastMLTAmountPer.b200.per +
                                                    "%" +
                                                    " | " +
                                                    beastMLTAmountPer.b200
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                            <CommonBtn
                                                onClick={() =>
                                                    handleBeastMint(
                                                        500,
                                                        TransitionUp
                                                    )
                                                }
                                                sx={{
                                                    fontSize: 14,
                                                    wordBreak: 'break-word',
                                                    fontWeight: "bold",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                500 (
                                                {"-" +
                                                    beastMLTAmountPer.b500.per +
                                                    "%" +
                                                    " | " +
                                                    beastMLTAmountPer.b500
                                                        ?.amount}{" "}
                                                $MLT)
                                            </CommonBtn>
                                        </Box>
                                    </Popover>
                                    <CommonBtn
                                        sx={{
                                            fontWeight: "bold",
                                            wordBreak: 'break-word',
                                            fontSize: 14,
                                            width: "100%",
                                            marginBottom: 1,
                                        }}
                                    >
                                        <NavLink
                                            to="/createlegions"
                                            className="non-style"
                                        >
                                            {getTranslation(
                                                "takeActionCreateLegion"
                                            )}
                                        </NavLink>
                                    </CommonBtn>
                                    <NavLink
                                        to="/hunt"
                                        className="non-style"
                                    >
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("hunt")}
                                        </CommonBtn>
                                    </NavLink>
                                    <NavLink
                                        to="/hunt"
                                        className="non-style"
                                    >
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                            }}
                                        >
                                            {getTranslation("takeActionMassHunt")}
                                        </CommonBtn>
                                    </NavLink>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={12} lg={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{ textAlign: "center", width: "100%" }}
                                >
                                    <NavLink
                                        to="/warriorsMarketplace"
                                        className="non-style"
                                    >
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation(
                                                "takeActionBuyWarriors"
                                            )}
                                        </CommonBtn>
                                    </NavLink>
                                    <NavLink
                                        to="/beastsMarketplace"
                                        className="non-style"
                                    >
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionBuyBeasts")}
                                        </CommonBtn>
                                    </NavLink>
                                    <NavLink
                                        to="/legionsMarketplace"
                                        className="non-style"
                                    >
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionBuyLegions")}
                                        </CommonBtn>
                                    </NavLink>
                                    <a href="" target='_blank'>
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {getTranslation("takeActionPoocoin")}
                                        </CommonBtn>
                                    </a>
                                    <a href="https://quickswap.exchange" target='_blank'>
                                        <CommonBtn
                                            sx={{
                                                fontWeight: "bold",
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                                width: "100%",
                                            }}
                                        >
                                            {getTranslation("takeActionBuyMLT")}
                                        </CommonBtn>
                                    </a>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Card>
    );
};

export default TakeAction;
