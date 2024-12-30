import React from 'react';
import { Box, Typography, Button, Chip, Stack } from '@mui/joy';
import { KaryaDummyClient } from 'karya-client/client/karya-dummy-client';

function Navbar({ user, client, onSignOut }) {
  const { name, version } = require('../../package.json'); // Importing package.json content

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: 'neutral.900',
        color: 'white',
        boxShadow: 'sm',
      }}
    >
      <Box>
        <Stack direction="row" spacing={1}>
          <Typography level="h4" sx={{ color: 'white' }}>
            {name} v{version}
          </Typography>
          {client instanceof KaryaDummyClient ? (
            <Chip size="sm" color="primary" variant="solid">
              Dummy
            </Chip>
          ) : (
            <Chip variant="solid" size="sm" color="success">
              Live Server
            </Chip>
          )}
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Typography level="body1">
          Scheduling jobs as user:{' '}
          <span
            style={{
              fontWeight: 'bold',
              color: 'primary.200',
              fontStyle: 'italic',
            }}
          >
            {user.name}
          </span>
        </Typography>
        <Button variant="soft" color="primary" onClick={onSignOut}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}

export default Navbar;
