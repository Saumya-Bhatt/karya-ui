import React, { useState } from 'react';
import { Box, Button, Input, Typography } from '@mui/joy';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { CreateUserRequest } from 'karya-client/client/requests';
import PopupStack from '../components/PopupStack';
import { KaryaRestClient } from 'karya-client/client/karya-rest-client.js';
import { KaryaDummyClient } from 'karya-client/client/karya-dummy-client.js';
import { ClientConfig } from 'karya-client/client/config.js';

function createKaryaRestClient(serverUrl) {
  if (!serverUrl) {
    throw new Error('Invalid server URL.');
  }

  const config = new ClientConfig(new URL(serverUrl));
  console.log(config);
  return new KaryaRestClient(config);
}

function SignIn({ client, setClient, setUser }) {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [popups, setPopups] = useState([]);

  const addPopup = (message, type) => {
    setPopups((prev) => [...prev, { message, type }]);
  };

  const removePopup = (index) => {
    setPopups((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (url.trim()) {
        try {
          const clientInstance = new createKaryaRestClient(url.trim());
          setClient(clientInstance);
          setActiveStep(1);
        } catch (error) {
          addPopup('Invalid URL or unable to connect.', 'error');
        }
      } else {
        const clientInstance = new KaryaDummyClient();
        setClient(clientInstance);
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      if (username.trim()) {
        let user;
        try {
          user = await client.getUser(username.trim());
        } catch (error) {
          console.log('User does not exist. Creating a new one.');
          try {
            user = await client.createUser(
              new CreateUserRequest(username.trim()),
            );
          } catch (error) {
            addPopup('Unable to connect to client: ' + error, 'error');
            console.log(error);
            return;
          }
        }
        console.log(user); // Log the resolved user object
        setUser(user); // Set the user after it's resolved
      } else {
        addPopup('Please enter a valid username.', 'error');
      }
    }
  };

  const steps = [
    {
      label: 'Enter Karya URL',
      description: (
        <>
          <Typography level="body-sm">
            This will point to Karya Server. Leave it blank if you want to use a
            stubbed client.
          </Typography>
          <Input
            placeholder="Enter API URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ width: '300px', fontSize: '1rem', mt: 2 }}
          />
        </>
      ),
    },
    {
      label: 'Enter Username',
      description: (
        <>
          <Typography level="body-sm">
            Create plans as a user or log in as an existing user.
          </Typography>
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ width: '300px', fontSize: '1rem', mt: 2 }}
          />
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
      }}
    >
      <PopupStack popups={popups} onRemove={removePopup} />
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.description}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleNext}
                  sx={{ mt: 1 }}
                >
                  {index === steps.length - 1 ? 'Sign In' : 'Next'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default SignIn;
