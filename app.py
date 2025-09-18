import os
import requests
from flask import Flask, render_template, redirect, url_for, session, request
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

# GitHub OAuth App settings
GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize'
GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
GITHUB_API_URL = 'https://api.github.com'

# --- Helper Function to format event data ---
def format_event(event):
    """Parses a GitHub event into a more readable format."""
    actor = event.get('actor', {})
    repo = event.get('repo', {})
    payload = event.get('payload', {})
    
    formatted = {
        'user': actor.get('login'),
        'avatar': actor.get('avatar_url'),
        'repo': repo.get('name'),
        'time': event.get('created_at'), # We will format this in the template
        'action': 'performed an action on'
    }

    event_type = event.get('type')
    if event_type == 'PushEvent':
        formatted['action'] = f"pushed {len(payload.get('commits', []))} commit(s) to"
    elif event_type == 'PullRequestEvent':
        action = payload.get('action') # e.g., 'opened', 'closed'
        formatted['action'] = f"{action} a pull request in"
    elif event_type == 'IssuesEvent':
        action = payload.get('action')
        formatted['action'] = f"{action} an issue in"
    elif event_type == 'WatchEvent':
        formatted['action'] = "starred"
    elif event_type == 'ForkEvent':
        formatted['action'] = "forked"
    
    return formatted

# --- Routes ---
@app.route('/')
def index():
    if 'github_token' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login')
def login():
    # Redirect user to GitHub for authorization
    # The 'read:user' scope is needed to see the list of people the user follows
    auth_url = f"{GITHUB_AUTH_URL}?client_id={GITHUB_CLIENT_ID}&scope=read:user"
    return redirect(auth_url)

@app.route('/github/callback')
def github_callback():
    # GitHub redirects here after authorization
    code = request.args.get('code')
    if not code:
        return "Error: No authorization code provided.", 400

    # Exchange the code for an access token
    token_payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    token_res = requests.post(GITHUB_TOKEN_URL, data=token_payload, headers=headers)
    token_json = token_res.json()

    access_token = token_json.get('access_token')
    if access_token:
        session['github_token'] = access_token
        return redirect(url_for('dashboard'))
    
    return "Error: Could not obtain access token.", 400

@app.route('/dashboard')
def dashboard():
    if 'github_token' not in session:
        return redirect(url_for('index'))

    access_token = session['github_token']
    headers = {'Authorization': f'token {access_token}'}

    # 1. Fetch authenticated user's info
    user_res = requests.get(f'{GITHUB_API_URL}/user', headers=headers)
    if user_res.status_code != 200:
        # Token might be invalid, clear session and redirect
        session.pop('github_token', None)
        return redirect(url_for('index'))
    user_data = user_res.json()

    # 2. Fetch the list of users the authenticated user is following
    following_res = requests.get(f'{GITHUB_API_URL}/user/following', headers=headers)
    following_list = following_res.json()

    # 3. Fetch events for each followed user (limited for performance)
    timeline_events = []
    for followed_user in following_list[:10]: # Limit to first 10 for speed
        username = followed_user['login']
        events_res = requests.get(f'{GITHUB_API_URL}/users/{username}/events/public', headers=headers)
        if events_res.status_code == 200:
            for event in events_res.json()[:5]: # Limit to 5 most recent events per user
                timeline_events.append(format_event(event))

    # Sort events by time (newest first)
    timeline_events.sort(key=lambda x: x['time'], reverse=True)

    return render_template('dashboard.html', user=user_data, following=following_list, timeline=timeline_events)

@app.route('/logout')
def logout():
    session.pop('github_token', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)