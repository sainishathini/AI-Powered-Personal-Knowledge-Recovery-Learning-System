# Google Drive Integration Setup Guide

This guide walks you through setting up Google OAuth 2.0 credentials to enable Google Drive folder syncing in **MemoryMap**.

---

## 🛠️ Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google Account.
3. Click the project dropdown at the top navigation bar and select **New Project**.
4. Project Name: `MemoryMap Knowledge Recovery` (or any preferred name).
5. Click **Create**.

---

## 🔌 Step 2: Enable the Google Drive API

1. In the Google Cloud Console navigation menu, go to **APIs & Services > Library**.
2. Search for **Google Drive API**.
3. Click on **Google Drive API** and click **Enable**.

---

## 🛡️ Step 3: Configure OAuth Consent Screen

1. Navigate to **APIs & Services > OAuth consent screen**.
2. Select **External** (or **Internal** if using Google Workspace) and click **Create**.
3. Fill in the required fields:
   - **App name**: `MemoryMap Personal Knowledge System`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes**:
   - Add `https://www.googleapis.com/auth/drive.readonly` (Read-only access to files).
6. Under **Test Users**, add your Google email address so you can test during development.
7. Click **Save and Continue**.

---

## 🔑 Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials** at the top and choose **OAuth client ID**.
3. Select **Application type**: `Web application`.
4. Name: `MemoryMap Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://localhost:5000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/auth/google/callback`
   - `http://localhost:5000/api/google/callback`
7. Click **Create**.
8. Copy your **Client ID** and **Client Secret**.

---

## ⚙️ Step 5: Configure Environment Variables

Create or update `.env` in the `server/` directory:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

---

## 🔒 Security & Privacy Practices

- **Minimal Permissions**: MemoryMap requests only `drive.readonly` access to permitted learning folders.
- **Local Storage**: Access tokens are kept on the backend server and never committed or exposed to frontend code.
- **Easy Disconnect**: Users can click **Disconnect Google Drive** at any time to remove tokens and halt synchronization.
- **Demo Fallback**: MemoryMap runs seamlessly in **Demo Mode** even if Google Drive credentials are not configured.
