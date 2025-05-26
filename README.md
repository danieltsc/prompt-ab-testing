# AB Testing Bot

A prompt A/B testing mini-app using Node.js, OpenAI, Next.js

## Overview 

This project allows users to:

- Create test cases
- Create different prompt variants
- Do A/B testing with different variants for all test cases and compare the results

## Technical Requirements

- Node.js (v16+)
- Yarn or npm

## Setup and Run Instructions

### API Server

1. Navigate to the `api` folder:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   yarn
   # or
   npm install
   ```

3. Configure OpenAI connection
   - Create an env file `api/.env`
   - Add the `OPENAI_KEY` (one can be generated on OpenAI Platform)

4. Start the development server:
   ```bash
   yarn start:dev
   # or
   npm run start:dev
   ```


### Client Server

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   yarn
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```