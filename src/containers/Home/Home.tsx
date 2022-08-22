import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CardsComponent from "../../component/Cards/Cards";
import {
    Grid,
    Card,
    Box,
    Button,
    Popover,
    Checkbox,
    Dialog,
    DialogTitle,
} from "@mui/material";
import { meta_constant } from "../../config/meta.config";
import Helmet from "react-helmet";
import { makeStyles } from "@mui/styles";
import { getTranslation } from "../../utils/translation";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";
import YourInventory from "./YourInventory";
import NadodoWatch from "./NadodoWatch";
import TakeAction from "./TakeAction";
import ToSocial from "./ToSocial";
import YourAchievements from "./YourAchievements";
import nicahBackground from "../../assets/images/nicah_background.jpg";
import ReactPlayer from "react-player/youtube";

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

const Home = () => {
    const [anchorElYourAchievement, setAnchorElYourAchievement] =
        React.useState<HTMLElement | null>(null);

    const handlePopoverOpenYourAchievement = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorElYourAchievement(event.currentTarget);
    };

    const handlePopoverCloseYourAchievement = () => {
        setAnchorElYourAchievement(null);
    };

    const openYourAchievement = Boolean(anchorElYourAchievement);

    return (
        <Box>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.home.title}</title>
                <meta
                    name="description"
                    content={meta_constant.home.description}
                />
                {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
                {meta_constant.home.keywords && (
                    <meta
                        name="keywords"
                        content={meta_constant.home.keywords.join(",")}
                    />
                )}
            </Helmet>
            <Grid container spacing={2} sx={{ my: 4 }}>
                <Grid item xs={12} md={4}>
                    <YourInventory />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TakeAction />
                </Grid>
                <Grid item xs={12} md={4}>
                    <NadodoWatch />
                </Grid>
            </Grid>
            <ToSocial />
            <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
                <Box sx={{ width: "100%" }}>
                    <Grid spacing={2} container>
                        <Grid item md={3} sm={2} xs={1}></Grid>
                        <Grid item md={3} sm={2} xs={1}></Grid>
                    </Grid>
                    <a
                        href="https://bongy-extoic.gitbook.io/maticmonsters/"
                        target={"blank"}
                        style={{ color: "white", border: "none" }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 2,
                                '&:hover': {
                                    color: '#f66810',
                                    transition: '.4s all'
                                }
                            }}
                        >
                            READ INSTRUCTIONS IN WHITEPAPER
                        </Typography>
                    </a>
                    <Grid container spacing={2} sx={{ my: 2, marginBottom: 4 }}>
                        <Grid item xs={12} md={1} lg={3}></Grid>
                        <Grid item xs={12} md={10} lg={6}>
                            <YourAchievements />
                        </Grid>
                        <Grid item xs={12} md={1} lg={3}></Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
