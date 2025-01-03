import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Link,
  Divider,
  Card,
  Typography,
} from '@mui/joy';
import { NavLink } from 'react-router-dom';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

function Sidebar() {
  const navLinkStyles = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? 'primary.700' : 'neutral.900',
    backgroundColor: isActive ? 'primary.softBg' : 'transparent',
    fontWeight: isActive ? 'bold' : 'normal',
    borderRadius: '8px',
    padding: '8px 16px',
  });

  return (
    <Box
      sx={{
        width: '21vw',
        backgroundColor: 'neutral.softBg',
        padding: '16px',
        boxShadow: 'sm',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Space out the content
      }}
    >
      <List>
        <ListItem>
          <Card variant="outline" color="warning">
            <Typography level="body-sm">
              The web client currently does not support chained actions.
            </Typography>
          </Card>
        </ListItem>
        <ListItem>
          <NavLink to="/schedule" style={navLinkStyles}>
            <ListItemButton>
              <ScheduleOutlinedIcon />
              Schedule Tasks
            </ListItemButton>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/jobs" style={navLinkStyles}>
            <ListItemButton>
              <FormatListBulletedOutlinedIcon />
              List all Plans
            </ListItemButton>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/job-summary" style={navLinkStyles}>
            <ListItemButton>
              <SummarizeOutlinedIcon />
              Plan Summary
            </ListItemButton>
          </NavLink>
        </ListItem>

        <Divider sx={{ margin: '16px 0' }} />

        <ListItem>
          <Link
            variant="soft"
            href="https://github.com/Saumya-Bhatt/karya"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemButton>About Karya</ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
