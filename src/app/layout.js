import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Idea Tracker - Capture Your Brilliant Ideas</title>
        <meta
          name="description"
          content="A beautiful and intuitive app to track and manage your brilliant ideas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23grad)'/><path d='M35 35 Q50 25 65 35 Q70 50 65 65 Q50 70 35 65 Q30 50 35 35' fill='%23FFD700' stroke='%23FFA500' stroke-width='2'/><circle cx='50' cy='45' r='3' fill='%23FFA500'/><rect x='47' y='60' width='6' height='8' fill='%23E6E6FA'/><rect x='45' y='68' width='10' height='4' rx='2' fill='%23E6E6FA'/></svg>"
        />
        <link
          rel="apple-touch-icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23grad)'/><path d='M35 35 Q50 25 65 35 Q70 50 65 65 Q50 70 35 65 Q30 50 35 35' fill='%23FFD700' stroke='%23FFA500' stroke-width='2'/><circle cx='50' cy='45' r='3' fill='%23FFA500'/><rect x='47' y='60' width='6' height='8' fill='%23E6E6FA'/><rect x='45' y='68' width='10' height='4' rx='2' fill='%23E6E6FA'/></svg>"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body>{children}</body>
    </html>
  );
}
