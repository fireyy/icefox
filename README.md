![Icefox Logo](/public/icefox.svg)

## Overview

Icefox is a Free, Open Source Feature Flagging and Remote Config Service like Flagsmith.

## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/fireyy/icefox.git
cd icefox
yarn install
```

### 2. Configure your local environment

Copy the .env.example file in this directory to .env (which will be ignored by Git):

```
cp .env.example .env
```

Add details for one or more providers (e.g. Google, Twitter, GitHub, Email, etc).

#### Database

A database is needed to persist user accounts and to support email sign in.

### 3. Configure Authentication Providers

1. Review and update options in `pages/api/auth/[...nextauth].js` as needed.

2. When setting up OAuth, in the developer admin page for each of your OAuth services, you should configure the callback URL to use a callback path of `{server}/api/auth/callback/{provider}`.

  e.g. For Google OAuth you would use: `http://localhost:3000/api/auth/callback/google`

  A list of configured providers and their callback URLs is available from the endpoint `/api/auth/providers`. You can find more information at https://next-auth.js.org/configuration/providers/oauth

3. You can also choose to specify an SMTP server for passwordless sign in via email.

### 4. Start the application

To run your site locally, use:

```
yarn dev
```

To run it in production mode, use:

```
yarn build
yarn start
```
