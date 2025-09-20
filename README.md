# GitHub Timeline Updates

A web application that allows you to connect your GitHub account and view a chronological timeline of public activity from the developers you follow.

![GitHub Timeline Updates](https://img.shields.io/badge/version-1.0.0-blue) ![Python](https://img.shields.io/badge/Python-3.8%2B-green) ![Flask](https://img.shields.io/badge/Flask-2.0%2B-lightgrey)

## ✨ Core Features

- **Secure GitHub OAuth2 Authentication**: Connect your GitHub account safely. The application only requests read-only access to your public data and following list.
- **Following List Display**: See a clean list of all the developers you currently follow on GitHub.
- **Aggregated Activity Feed**: View a real-time, consolidated timeline of the most recent public activities (pushes, pull requests, issues, stars) from everyone you follow.
- **Clean & Responsive UI**: A modern user interface built with Tailwind CSS that works seamlessly on both desktop and mobile devices.

## 🛠️ Technology Stack

- **Backend**: Python 3, Flask
- **API Interaction**: Requests
- **Frontend**: HTML, Tailwind CSS
- **Environment Management**: python-dotenv

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Python 3.8 or newer
- pip (Python package installer)
- A GitHub account

### 1. Set Up Your GitHub OAuth App

Before running the application, you need to register it with GitHub to get API credentials.

1. Navigate to your GitHub Settings > Developer settings > OAuth Apps.
2. Click "New OAuth App".
3. Fill out the form with the following details:
   - **Application name**: GitHub Timeline Updates (or any name you prefer)
   - **Homepage URL**: http://127.0.0.1:5000
   - **Authorization callback URL**: http://127.0.0.1:5000/github/callback
4. Click "Register application".
5. On the next page, copy your Client ID and generate a new Client Secret. You will need these in the next step.

### 2. Installation & Configuration

Now, let's set up the project on your local machine.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/github-timeline.git
cd github-timeline

# 2. Create and activate a virtual environment (recommended)
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
py -m venv venv
venv\Scripts\activate

# 3. Install the required packages
pip install -r requirements.txt

# 4. Create the environment file
# Create a file named .env in the root directory and add your credentials
```

Your `.env` file should look like this. Do not share this file or commit it to Git.

```env
# Generate a random string for this using: python -c 'import secrets; print(secrets.token_hex(16))'
FLASK_SECRET_KEY='YOUR_GENERATED_SECRET_KEY_HERE'

# Paste the credentials from your GitHub OAuth App
GITHUB_CLIENT_ID='YOUR_GITHUB_CLIENT_ID_HERE'
GITHUB_CLIENT_SECRET='YOUR_GITHUB_CLIENT_SECRET_HERE'
```

### 3. Running the Application

With everything configured, you can now start the Flask server.

```bash
# Start the development server
flask run
```

Open your web browser and navigate to http://127.0.0.1:5000 to see the application in action!

## 📁 Project Structure

```
github-timeline/
├── .env                  # Stores secret keys and credentials (ignored by Git)
├── app.py                # Main Flask application logic, routes, and API calls
├── requirements.txt      # List of Python dependencies
├── templates/
│   ├── dashboard.html    # The user's main activity feed page
│   ├── index.html        # The public landing page
│   └── layout.html       # Base HTML template with header and footer
└── README.md             # This file
```

## 🔮 Future Enhancements

This project serves as a great foundation. Here are some ideas for future improvements:

- **Email Digests**: Implement a background job (using Celery or APScheduler) to send daily or weekly email summaries of activity.
- **Advanced Filtering**: Allow users to filter the timeline by event type (e.g., only show commits) or by specific users.
- **Database Integration**: Store user data and preferences in a database like PostgreSQL or SQLite for persistence.
- **Real-time Updates**: Use WebSockets to push new events to the dashboard in real-time without needing a page refresh.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.