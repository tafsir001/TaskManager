# Mean Task Manager

A full-stack Task Management Application built using Angular (frontend) and Node.js (backend). This application provides user authentication, task management features, and status-based filter

## Features

- User Authentication: Sign up, login, and token-based session management.
- Task Management:
    - Create, read, update and delete tasks.
    - Filter tasks by their status (completed/pending)
- Secure API: Backend secured with JWT authentication.

## Installation

## Prerequisites

- Node.js and npm installed.
- Angular CLI installed globally.

## Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/tafsir001/TaskManager.git
    cd TaskManager

2. **Install dependencies for both frontend and backend**

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../taskmanager
    npm install
    
3. **Run the backend**

    ```bash
    cd ../backend
    npm start
    
4. **Let the backend run and open another terminal**

5. **Serve the frontend**

    ```bash
    cd taskmanager
    npm start

6. **Open the application in your browser**

    ```bash
    http://localhost:4200
