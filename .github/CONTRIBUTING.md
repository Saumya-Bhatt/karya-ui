# Contributing

Firstly, thank you for considering contributing to this project. We appreciate your time and effort. Please read the following guidelines before contributing.

## How can I contribute?

Karya is in no way a finished project. There's always room for improvements. Be it in terms of performance or documentation ro adding new features or fixing bugs! Following are some of the ways one can contribute to Karya:

1. Documentation - There is never enough documentation to explain something simply by reading it. But we can try!
2. Bug Fix - Noticed a bug? Just report it! Or if you're a seluth, go and raise a PR! This is in no way a bug-free software.
3. New Features - Currently the python client is a web-based client beacause the _karya server_ itself supports REST calls currently. But who knows, in the future we might move to something better!
4. Refactoring - There are always better ways to write a code. Go ahead and give it a shot at writing this client better, to make it more concise and easier to read.

## Local Setup

1. Clone the repository
2. Make sure node and npm are installed on your system. If not, install them from [here](https://nodejs.org/en/download/)
2. Install the dependencies
    ```shell
    npm install
    ```
3. Run the react server
    ```shell
    npm start
    ``` 

> To mock the backend, you can skip passing the environment variable `REACT_APP_API_URL` and the client will use stubbed responses to test out the UI.

## Naming Conventions

1. **File Names**: File names should be in `PascalCase` (all words in uppercase).
2. **Variable Names**: Variable names should be in `camelCase` (first word in lowercase and subsequent words in uppercase).
3. **Function Names**: Function names should be in `camelCase` (first word in lowercase and subsequent words in uppercase).
4. **Class Names**: Class names should be in `PascalCase` (all words in uppercase).

## Formatting and Linting

**NOTE:** Only commits with correctly formatted and linted code will ab allowed to merge to main.

1. Run the following command to format the code

    ```shell
    npm run format
    ```
2. Run the following command to lint the code

    ```shell
    npm run lint:fix
    ```

## Docker

To build the docker image, run the following command:

```shell
docker build -t karya-ui .   
```