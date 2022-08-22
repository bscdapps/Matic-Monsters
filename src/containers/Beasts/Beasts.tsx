import React from 'react';
import Helmet from 'react-helmet';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, IconButton, FormLabel, FormControl, Dialog, DialogTitle, DialogContent, TextField, Popover } from '@mui/material';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { meta_constant } from '../../config/meta.config';
import { setReloadStatus } from '../../actions/contractActions';
import { getBeastMOONLIGHTAllowance, setBeastMOONLIGHTApprove, mintBeast, getBeastBalance, getBeastTokenIds, getBeastToken, getBaseUrl, setMarketplaceApprove, sellToken, execute, getMOONLIGHTAmountToMintBeast, getFee } from '../../hooks/contractFunction';
import { useMOONLIGHT, useBeast, useMarketplace, useLegion, useFeeHandler, useWeb3 } from '../../hooks/useContract';
import BeastCard from '../../component/Cards/BeastCard';
import CommonBtn from '../../component/Buttons/CommonBtn';
import { getTranslation } from '../../utils/translation';
import Image from '../../config/image.json';
import { FaTimes } from "react-icons/fa";

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '180px'
	},
	warning: {
		display: 'flex',
		minHeight: '80px',
	}
});

type BeastProps = {
	id: string;
	type: string;
	capacity: string;
	strength: string;
	gif: string;
	jpg: string;
};

const Beasts = () => {
	const {
		account,
	} = useWeb3React();

	const [baseUrl, setBaseUrl] = React.useState('');
	const [showMint, setShowMint] = React.useState(false);
	const [balance, setBalance] = React.useState(0);
	const [maxWarrior, setMaxWarrior] = React.useState(0);
	const [beasts, setBeasts] = React.useState<BeastProps[]>(Array);
	const [openSupply, setOpenSupply] = React.useState(false);
	const [selectedBeast, setSelectedBeast] = React.useState(0);
	const [price, setPrice] = React.useState(0);
	const [filter, setFilter] = React.useState('all');
	const [marketplaceTax, setMarketplaceTax] = React.useState('0');
	const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
	const [loading, setLoading] = React.useState(false);
	const [mintLoading, setMintLoading] = React.useState(false);
	const [actionLoading, setActionLoading] = React.useState(false);

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


	const classes = useStyles();
	const beastContract = useBeast();
	const legionContract = useLegion();
	const marketplaceContract = useMarketplace();
	const feeHandlerContract = useFeeHandler();
	const MOONLIGHTContract = useMOONLIGHT();
	const web3 = useWeb3();
	const dispatch = useDispatch();

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
		if (account) {
			getBalance();
			getMLTAmountToMintBeast();
		}
		setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0');
	}, []);


	const handleOpenMint = () => {
		setShowMint(true);
	};

	const handleCloseMint = () => {
		setShowMint(false);
	};

	const handleMint = async (amount: Number) => {
		handlePopoverCloseSummonBeast();
		setMintLoading(true);
		setLoading(false);
		const allowance = await getBeastMOONLIGHTAllowance(web3, MOONLIGHTContract, account);
		try {
			if (allowance === '0') {
				await setBeastMOONLIGHTApprove(web3, MOONLIGHTContract, account);
			}
			await mintBeast(web3, beastContract, account, amount);
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}));
		} catch (e) {
			console.log(e);
		}
		getBalance();
		setMintLoading(false);
	}

	const getBalance = async () => {
		setLoading(true);
		setMarketplaceTax(((await getFee(feeHandlerContract, 0)) / 100).toFixed(0));
		setBaseUrl(await getBaseUrl());
		setBalance(parseInt(await getBeastBalance(web3, beastContract, account)));
		const ids = await getBeastTokenIds(web3, beastContract, account);
		let amount = 0;
		let beast;
		let tempBeasts = [];
		let gif = '';
		let jpg = '';
		for (let i = 0; i < ids.length; i++) {
			beast = await getBeastToken(web3, beastContract, ids[i]);
			for (let j = 0; j < Image.beasts.length; j++) {
				if (Image.beasts[j].name === beast.type) {
					gif = Image.beasts[j].gif;
					jpg = Image.beasts[j].jpg;
				}
			}
			tempBeasts.push({ ...beast, id: ids[i], gif: gif, jpg: jpg });
			amount += parseInt(beast.capacity);
		}
		setMaxWarrior(amount);
		setBeasts(tempBeasts);
		setLoading(false);
	}

	const handleSupplyClose = () => {
		setOpenSupply(false);
	};

	const handleOpenSupply = (id: number) => {
		setSelectedBeast(id);
		setOpenSupply(true);
	}

	const handlePrice = (e: any) => {
		setPrice(e.target.value);
	}

	const handleSendToMarketplace = async () => {
		setActionLoading(true);
		setOpenSupply(false);
		try {
			await setMarketplaceApprove(web3, beastContract, account, selectedBeast);
			await sellToken(web3, marketplaceContract, account, '1', selectedBeast, price);
			let capacity = 0;
			let temp = beasts;
			for (let i = 0; i < temp.length; i++) {
				if (parseInt(temp[i]['id']) === selectedBeast)
					capacity = parseInt(temp[i]['capacity']);
			}
			setMaxWarrior(maxWarrior - capacity);
			setBalance(balance - 1);
			setBeasts(beasts.filter((item: any) => parseInt(item.id) !== selectedBeast));
		} catch (e) {
			console.log(e);
		}
		setActionLoading(false);
	}

	const handleExecute = async (id: number) => {
		setActionLoading(true);
		try {
			await execute(web3, legionContract, account, true, id);
			setBeasts(beasts.filter((item: any) => parseInt(item.id) !== id));
			dispatch(setReloadStatus({
				reloadContractStatus: new Date()
			}));
		} catch (e) {
			console.log(e);
		}
		setActionLoading(false);
	}

	return <Box>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{meta_constant.beasts.title}</title>
			<meta name="description" content={meta_constant.beasts.description} />
			{meta_constant.beasts.keywords && <meta name="keywords" content={meta_constant.beasts.keywords.join(',')} />}
		</Helmet>
		<Grid container spacing={2} sx={{ my: 4 }}>
			<Grid item xs={12}>
				<Card>
					<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
							<Typography variant='h3' sx={{ fontWeight: 'bold' }}>
								{getTranslation('beasts')}
							</Typography>
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('summonBeast')}
						</Typography>
						<Box onMouseOver={handleOpenMint} onMouseLeave={handleCloseMint} sx={{ pt: 1 }}>
							<CommonBtn
								sx={{ fontWeight: 'bold' }}
								onClick={handlePopoverOpenSummonBeast}
								aria-describedby={"summon-beast-id"}
							>
								<IconButton aria-label="claim" component="span" sx={{ p: 0, mr: 1, color: 'black' }}>
									<HorizontalSplitIcon />
								</IconButton>
								{getTranslation('summonQuantity')}
							</CommonBtn>
							<Popover
								id={"summon-beast-id"}
								open={openSummonBeast}
								anchorEl={anchorElSummonBeast}
								onClose={handlePopoverCloseSummonBeast}
								anchorOrigin={{
									vertical: "center",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "center",
									horizontal: "left",
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
											handleMint(
												1
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
											handleMint(
												10
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										10 (
										{"-" +
											beastMLTAmountPer.b10.per +
											"%" +
											" | " +
											beastMLTAmountPer.b10
												?.amount}{" "}
										$MLT)
									</CommonBtn>
									<CommonBtn
										onClick={() =>
											handleMint(
												50
											)
										}
										sx={{
											fontSize: 14,
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
											handleMint(
												200
											)
										}
										sx={{
											fontSize: 14,
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
											handleMint(
												500
											)
										}
										sx={{
											fontSize: 14,
											fontWeight: "bold",
											marginBottom: 1,
										}}
									>
										500 (
										{"-" +
											beastMLTAmountPer.b500
												.per +
											"%" +
											" | " +
											beastMLTAmountPer.b500
												?.amount}{" "}
										$MLT)
									</CommonBtn>
								</Box>
							</Popover>
						</Box>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('currentBeasts')}
						</Typography>
						<Typography variant='h4' color='secondary' sx={{ fontWeight: 'bold' }}>
							{balance}
						</Typography>
						<CommonBtn sx={{ fontWeight: 'bold', mt: 1 }}>
							<NavLink to='/createlegions' className='non-style'>
								{getTranslation('createLegion')}
							</NavLink>
						</CommonBtn>
					</Box>
				</Card>
			</Grid>
			<Grid item xs={12} md={4}>
				<Card>
					<Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
							{getTranslation('warriorCapacity')}
						</Typography>
						<Typography variant='h4' color='primary' sx={{ fontWeight: 'bold' }}>
							{maxWarrior}
						</Typography>
					</Box>
				</Card>
			</Grid>
		</Grid>
		{
			(loading === false && mintLoading === false && actionLoading === false) &&
			<React.Fragment>
				<Grid container spacing={2} sx={{ my: 3 }}>
					<Grid item md={12}>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{ marginBottom: 12 }}>{getTranslation('filterCapacity')}:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
								<Button variant={`${filter === 'all' ? 'contained' : 'outlined'}`} onClick={() => setFilter('all')}>{getTranslation('all')}</Button>
								<Button variant={`${filter === '1' ? 'contained' : 'outlined'}`} onClick={() => setFilter('1')}>1</Button>
								<Button variant={`${filter === '2' ? 'contained' : 'outlined'}`} onClick={() => setFilter('2')}>2</Button>
								<Button variant={`${filter === '3' ? 'contained' : 'outlined'}`} onClick={() => setFilter('3')}>3</Button>
								<Button variant={`${filter === '4' ? 'contained' : 'outlined'}`} onClick={() => setFilter('4')}>4</Button>
								<Button variant={`${filter === '5' ? 'contained' : 'outlined'}`} onClick={() => setFilter('5')}>5</Button>
								<Button variant={`${filter === '20' ? 'contained' : 'outlined'}`} onClick={() => setFilter('20')}>20</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mb: 4 }}>
					{
						beasts.filter((item: any) => filter === 'all' ? parseInt(item.capacity) >= 0 : item.capacity === filter).map((item: any, index) => (
							<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
								<BeastCard image={(showAnimation === '0' ? baseUrl + item['jpg'] : baseUrl + item['gif'])} type={item['type']} capacity={item['capacity']} strength={item['strength']} id={item['id']} isMobile={false} needButton={true} handleOpenSupply={handleOpenSupply} handleExecute={handleExecute} />
							</Grid>
						))
					}
					{
						(beasts.length > 0 && beasts.filter((item: any) => filter === 'all' ? parseInt(item.capacity) >= 0 : item.capacity === filter).length === 0) &&
						<Grid item xs={12}>
							<Card>
								<Box className={classes.warning} sx={{ p: 4, justifyContent: 'start', alignItems: 'center' }}>
									<Box sx={{ display: 'flex', flexDirection: 'column', mx: 4 }}>
										<Typography variant='h6'>
											{getTranslation('noBeastFilter')}
										</Typography>
									</Box>
								</Box>
							</Card>
						</Grid>
					}
				</Grid>
			</React.Fragment>
		}
		{
			loading === true &&
			<>
				<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant='h4' >{getTranslation('loadingBeasts')}</Typography>
				</Grid>
				<Grid container sx={{ justifyContent: 'center' }}>
					<Grid item xs={1}>
						<Card>
							<CardMedia
								component="img"
								image="/assets/images/loading.gif"
								alt="Loading"
								loading="lazy"
							/>
						</Card>
					</Grid>
				</Grid>
			</>
		}
		{
			mintLoading === true &&
			<>
				<Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant='h4' >{getTranslation('summoningBeasts')}</Typography>
				</Grid>
				<Grid container sx={{ justifyContent: 'center' }}>
					<Grid item xs={1}>
						<Card>
							<CardMedia
								component="img"
								image="/assets/images/loading.gif"
								alt="Loading"
								loading="lazy"
							/>
						</Card>
					</Grid>
				</Grid>
			</>
		}
		{
			actionLoading === true && (
				<>
					<Grid item xs={12} sx={{ p: 4, textAlign: "center" }}>
						<Typography variant="h4">
							{getTranslation("pleaseWait")}
						</Typography>
					</Grid>
					<Grid container sx={{ justifyContent: "center" }}>
						<Grid item xs={1}>
							<Card>
								<CardMedia
									component="img"
									image="/assets/images/loading.gif"
									alt="Loading"
									loading="lazy"
								/>
							</Card>
						</Grid>
					</Grid>
				</>
			)}
		<Dialog onClose={handleSupplyClose} open={openSupply}>
			<DialogTitle>{getTranslation('listOnMarketplace')}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="price"
					label="Price in $MLT"
					type="number"
					fullWidth
					variant="standard"
					value={price}
					onChange={handlePrice}
				/>
				<Typography variant='subtitle1'>
					(= XXX USD)
				</Typography>
				<Typography variant='subtitle1'>
					If sold, you will pay {marketplaceTax}% marketplace tax.
				</Typography>
			</DialogContent>
			<CommonBtn sx={{ fontWeight: 'bold' }} onClick={handleSendToMarketplace}>
				{getTranslation('sell')}
			</CommonBtn>
		</Dialog>
	</Box>
}

export default Beasts