import React from 'react';

// Minimal Google OAuth callback placeholder.
// The app imports this route. Implement full OAuth handling later if needed.
export function GoogleCallback() {
  return (
    <div className="mx-auto max-w-screen-md p-6 text-center">
      <h2 className="text-lg font-medium">Processing Google sign-in...</h2>
      <p className="mt-2 text-sm text-muted-foreground">You will be redirected shortly.</p>
    </div>
  );
}

export default GoogleCallback;
