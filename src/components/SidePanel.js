import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
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
  });

class SidePanel extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            hideSidePanel: false
            , project: ''
            , phase: ''
            , pid:''
        };
        this.toggleVis = this.toggleVis.bind(this);
    }
    update = (e) => {
        console.log(e.target.value);
        this.props.onUpdate(e.target.value);
        this.setState({fieldVal: e.target.value});
    };
    handleChange = name => event => {
        this.state.pid = 'testit';
        this.setState({
            [name]: event.target.value,
        });
    };
    toggleVis(event){
        this.state.hideSidePanel ? this.setState({hideSidePanel:false}): this.setState({hideSidePanel:true});
    }

    render() {
        const { classes } = this.props;
        console.log('classes: ' + JSON.stringify(classes));
        //let{dataFromMap} = 
        return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            {/* <IconButton class='sideNavButton'><NavigationClose /></IconButton> */}
            <div>
                <Fade in={this.state.hideSidePanel} timeout={1000}>
                    <div className='sideNavButton'>
                        <FloatingActionButton onClick={this.toggleVis} >
                            <Icon>build</Icon>
                        </FloatingActionButton>
                    </div>
                </Fade>
                <Fade in={!this.state.hideSidePanel} timeout={1000}>
                    <Paper className="sideNav"  >
                        <AppBar className={classes.appBar} title="sidePanel" iconElementLeft={(<div />)}  iconElementRight={<IconButton onClick={this.toggleVis}><NavigationClose /></IconButton>}>
                            
                        </AppBar>
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
                        
                        <Fade in={this.props.address!=null} timeout={1000}>
                            <Paper className={classes.paper} elevation={1} >
                                <Grid container spacing={8}>
                                    <Grid item xs={12}>
                                        <div className={classes.type}>
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
                                            {/* <Typography variant="h3" gutterBottom>
                                                h3. Heading
                                            </Typography>
                                            <Typography variant="h4" gutterBottom>
                                                h4. Heading
                                            </Typography>
                                            <Typography variant="h5" gutterBottom>
                                                h5. Heading
                                            </Typography>
                                            <Typography variant="h6" gutterBottom>
                                                h6. Heading
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                                            </Typography>
                                            <Typography variant="subtitle2" gutterBottom>
                                                subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                                                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                                                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                                                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                                                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
                                            </Typography>
                                            <Typography variant="button" gutterBottom>
                                                button text
                                            </Typography>
                                            <Typography variant="caption" gutterBottom>
                                                caption text
                                            </Typography>
                                            <Typography variant="overline" gutterBottom>
                                                overline text
                                            </Typography> */}
                                        </div>
                                    </Grid>
                                </Grid>        
                            </Paper>     
                        </Fade>
                        </FormControl>
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