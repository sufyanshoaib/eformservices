# Specification: User Authentication

## ADDED Requirements

### Requirement: Social Login
The system SHALL allow users to sign in using their existing Google or Facebook accounts.

#### Scenario: User visits login page
Given an unauthenticated user
When they visit `/auth/signin`
Then they should see a "Sign in with Google" button
And they should see a "Sign in with Facebook" button

#### Scenario: User signs in with Google
Given a user on the login page
When they click "Sign in with Google"
Then they should be redirected to the Google OAuth consent screen
And upon successful consent, they should be redirected back to the dashboard (or original URL) and be logged in

#### Scenario: User signs in with Facebook
Given a user on the login page
When they click "Sign in with Facebook"
Then they should be redirected to the Facebook OAuth consent screen
And upon successful consent, they should be redirected back to the dashboard and be logged in
