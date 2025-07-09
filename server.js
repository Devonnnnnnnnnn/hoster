const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/", (req, res) => res.send("Pinger is active"));

app.listen(3000, () => {
  console.log("🌐 Pinger web server running on port 3000");

  // Ping both projects every 4.5 minutes (~270 seconds)
  setInterval(() => {
    console.log("🔁 Sending pings...");

    fetch("https://devonnnnnnnnnn.github.io/alex/") // Replace with your bot's URL
      .then(res => console.log("✅ Pinged bot:", res.status))
      .catch(err => console.error("❌ Failed to ping bot:", err));

    fetch("https://devonnnnnnnnnn.github.io/hoster/") // Self-ping
      .then(res => console.log("✅ Self-pinged:", res.status))
      .catch(err => console.error("❌ Failed self-ping:", err));
  }, 270000); // 4.5 minutes
});
