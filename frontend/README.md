## Features and Rules

Just like in the API, we have the following features and rules:

- [ ] Users can create an account and log in
- [ ] Users can view and manage only the transactions and categories they created
- [ ] It must be possible to create a transaction
- [ ] It must be possible to delete a transaction
- [ ] It must be possible to edit a transaction
- [ ] It must be possible to list all transactions
- [ ] It must be possible to create a category
- [ ] It must be possible to delete a category
- [ ] It must be possible to edit a category
- [ ] It must be possible to list all categories

In addition, we have some important front-end-specific rules:

- [ ] Creating a React application using GraphQL for API queries and Vite as the bundler is mandatory;
- ] Follow the Figma layout as closely as possible;

## Pages

This application has 6 pages and two modals with forms (Dialog):

- The root page (`/`) displays:
  - Login screen if the user is logged out
  - Dashboard screen if the user is logged in

## Tools

The following are mandatory:

- TypeScript
- React
- Vite without a framework
- GraphQL

The following are optional:

- TailwindCSS
- Shadcn
- React Query
- React Hook Form
- Zod

## Environment Variables

Every project has various variable configurations that differ depending on the environment in which it runs. Therefore, it's important to easily and intuitively know what these variables are. Thus, this project must have an `.env.example` file with the necessary keys.
