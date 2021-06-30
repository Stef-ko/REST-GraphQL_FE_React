import React from "react";
import { makeStyles, Paper, Tabs, Tab } from "@material-ui/core";
import { Link } from "react-router-dom";

function Header(props, history) {
  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // this.props.history.push(value);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='primary'
        centered
      >
        <Tab label='REST' component={Link} to='/rest' />
        <Tab label='GraphQL' component={Link} to='/graphql' />
      </Tabs>
    </Paper>
  );
}

export default Header;
