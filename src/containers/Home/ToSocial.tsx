import * as React from 'react'
import { Grid } from '@mui/material'
import ToSocialBtn from '../../component/Buttons/ToSocialBtn';
import SwitchNFTtype from '../../component/Buttons/SwitchNFTtype';

const ToSocial = () => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <ToSocialBtn
                type="Discord"
                linkUrl=""
            />
            <ToSocialBtn
                type="Telegram"
                linkUrl=""
            />
            <ToSocialBtn
                type="Twitter"
                linkUrl=""
            />
            <ToSocialBtn
                type="Youtube"
                linkUrl=""
            />
            <ToSocialBtn
                type="Medium"
                linkUrl=""
            />
            <SwitchNFTtype />
        </Grid>
    )
}

export default ToSocial