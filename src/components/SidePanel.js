import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import NavigationIcon from '@material-ui/icons/DoneAll';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Fab from '@material-ui/core/Fab';
import AppBar from 'material-ui/AppBar';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'
import FormLabel from '@material-ui/core/FormLabel'
import Icon from '@material-ui/core/Icon';
import './SidePanel.css';




function handleClick(event) {
    console.log('shut the door')
}

const styles = theme => ({
    appBar: {
      position: 'relative',
    }
    , textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
    , paper: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
    , type: {
        width: '100%',
        maxWidth: 500,
        paddingLeft: 15
    }
    , typeTitle: {
        paddingTop: 5
    }
    , addButton: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    }
    , deleteButton: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    }
    , extendedIcon: {
        marginRight: theme.spacing.unit*2,
    }
  });

class SidePanel extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            project: ''
            , phase: ''
            , showAddButton: false
            , anchorEl: null
            , editAction: 'add'
        };
        this.menuClick = this.menuClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    update = (e) => {
        console.log(e.target.value);
        this.props.onUpdate(e.target.value);
        this.setState({fieldVal: e.target.value});
    };
    handleChange = name => event => {
        this.props.projectPhaseCallback(name, event.target.value)
        this.setState({
            [name]: event.target.value,
        }, () => {
            if(this.state.project && this.state.phase){
                this.setState({showAddButton: true})
            }
            else{
                this.setState({showAddButton: false})
            }
        });
    };
    menuClick = (e) =>{
        this.setState({anchorEl : e.currentTarget})
    }
    
    handleClose = key => e => {
        console.log('key: ' + key)
        this.setState({editAction:key})
        this.setState({anchorEl : null})
    }
    addSelectedProperties = () =>{
        this.props.addSelectedProperties()
    }
    render() {
        const { classes } = this.props;
        console.log('classes: ' + JSON.stringify(classes));
        //let{dataFromMap} = 
        return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            {/* <IconButton class='sideNavButton'><NavigationClose /></IconButton> */}
            <div>
                {/* <Fade in={this.state.hideSidePanel} timeout={1000}>
                    <div className='sideNavButton'>
                        <FloatingActionButton onClick={this.toggleVis} >
                            <Icon>build</Icon>
                        </FloatingActionButton>
                    </div>
                </Fade> */}
                <Fade in={!this.props.hideSidePanel} timeout={1000}>
                    <Paper className="sideNav"  >
                        <AppBar className={classes.appBar} title="Add Project" iconElementLeft={(
                            <IconButton color="inherit" aria-label="Menu" 
                                aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true" 
                                onClick={this.menuClick}>
                                <MenuIcon />
                            </IconButton>)} 
                        >
                        <Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onChange={this.handleClose}>
                            <MenuItem onClick={this.handleClose('add')}>Add</MenuItem>
                            <MenuItem onClick={this.handleClose('remove')}>Remove</MenuItem>
                        </Menu>
                        </AppBar>
                        {this.state.editAction==='add' ? (
                            <FormControl margin='normal'>
                            <FormLabel/>
                                <TextField
                                    id="tf_project"
                                    label="Project"
                                    className={classes.textField}
                                    value={this.state.project}
                                    onChange={this.handleChange('project')}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    id="tf_phase"
                                    label="Phase"
                                    className={classes.textField}
                                    value={this.state.phase}
                                    onChange={this.handleChange('phase')}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Fade in={this.state.showAddButton} timeout={1000}>
                                    <Fab variant="extended" 
                                        color="primary" 
                                        aria-label="Add" 
                                        className={classes.addButton}
                                        onClick={this.addSelectedProperties}>
                                        <NavigationIcon className={classes.extendedIcon} />
                                        <b>Add Selection</b>
                                    </Fab>
                                </Fade>
                            </FormControl>
                        ) : (
                            <FormControl margin='normal'>
                                
                                    <Fab variant="extended" color="primary" aria-label="Add" className={classes.deleteButton}>
                                        <DeleteIcon className={classes.extendedIcon} />
                                        <b>Delete Selection</b>
                                    </Fab>
                            </FormControl>
                        )}                
                        
{/*                         
                        <Fade in={this.props.address!=null} timeout={1000}>
                            <Paper className={classes.paper} elevation={1} >
                                <Grid container spacing={8}>
                                    <Grid item xs={12}>
                                        <div className={classes.type}>
                                            <h3>Property Info</h3>
                                            <Typography component="h2" variant="subtitle2" align='justify' gutterBottom>
                                            Address
                                            </Typography>
                                            <Typography variant="body1" align='justify' gutterBottom>
                                            {this.props.address}
                                            </Typography>
                                            <Typography className={classes.padding5} component="h2" variant="subtitle2" align='justify' gutterBottom>
                                            PIN
                                            </Typography>
                                            <Typography variant="body1" align='justify' gutterBottom>
                                            {this.props.PIN}
                                            </Typography>
                                            <Typography className={classes.padding5} component="h2" variant="subtitle2" align='justify' gutterBottom>
                                            <Button variant="outlined" size="small" color="primary" className={classes.margin}>
                                                <a href={this.props.realLink}>Real Estate</a>
                                            </Button>
                                            </Typography>
                                            <Typography className={classes.padding5} component="h2" variant="subtitle2" align='justify' gutterBottom>
                                            <Button variant="outlined" size="small" color="primary" className={classes.margin}>
                                                <a href={this.props.deedLink}>Deed</a>
                                            </Button>
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>        
                            </Paper>     
                        </Fade> */}
                        
                    </Paper>
                    
                </Fade>
            </div>
        </MuiThemeProvider>
        );
    }
}
SidePanel.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(SidePanel);