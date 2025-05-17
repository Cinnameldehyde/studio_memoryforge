## Flashcard App 
This project is a web application built with Next.js. It helps users learn and retain information through flashcards and the spaced repetition learning technique (specifically, an implementation of the SM2 algorithm). The goal is to provide a self-contained learning tool that can be used without a constant internet connection.

## Offline Functionality

This project is designed to function offline once all necessary dependencies and configurations are in place. To achieve this, you need to ensure:

- All project dependencies are included.
- Environment configurations are set up for a local environment.
- Any necessary local services (like databases) are running.

## Features
- **Offline Functionality:** The project is designed to work without a continuous internet connection.
- **User Authentication:** Secure login and signup using Firebase Authentication.
- **Flashcard Management:** Add, edit, and delete flashcards. Each flashcard consists of a question and an answer.
- **Spaced Repetition:** Implement the SM2 algorithm to schedule flashcard reviews based on user performance, optimizing learning efficiency.
- **Review Mode:** A dedicated section for reviewing scheduled flashcards.
- **Dashboard:** A central place to see an overview of flashcard progress and upcoming reviews.
- **Responsive Design:** The application is designed to be accessible and usable on various devices.
- **AI Integration (Planned):** Future plans include leveraging AI to generate flashcards from text.

## Installation

To make this project work offline, you need to include all dependencies and configure it for a local environment.

1. **Clone the repository:**


2. **Include Dependencies:**

   Ensure you have all necessary project dependencies. For this project, which uses Node.js, this means including the `node_modules` folder. This folder contains all the libraries and frameworks your project relies on.

3. **Environment Configuration:**

   Review and configure any environment variables your project uses for a local environment. Also, check configuration files for any settings related to external services or asset loading that might need to be adjusted for offline use.

4. **Local Services:**

   If the project uses a database or interacts with APIs, you will need to set up local alternatives or modify the code to use local data.
   - **Databases:** If a database is used, set up a local instance (e.g., SQLite, or a local instance of your database) and include any necessary database files or scripts.
   - **APIs:** If external APIs are used, you might need to mock them or adapt the code to work with local data.

5. **Building and Running:**

   Ensure your project can be built and run locally without internet access. This may involve configuring build tools to use local dependencies. You should be able to start the application using commands like `npm start` or similar scripts defined in `package.json`.

To get started with the code, you can explore `src/app/page.tsx`.

## Usability

*(Placeholder: Describe how easy or intuitive the application is to use, focusing on the user experience for offline learning.)*

## Screenshots

*(Placeholder: Add screenshots of your application here to visually showcase its features and interface.)*
