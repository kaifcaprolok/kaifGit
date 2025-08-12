const fs = require("fs");
const fetch = require("node-fetch");

const API_KEY = process.env.YT_API_KEY;
const CHANNEL_ID = process.env.YT_CHANNEL_ID;
const LAST_ID_FILE = "last_video_id.txt";

async function checkYouTube() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    console.log("No videos found.");
    return;
  }

  const latestVideoId = data.items[0].id.videoId;
  const latestTitle = data.items[0].snippet.title;

  let lastVideoId = "";
  if (fs.existsSync(LAST_ID_FILE)) {
    lastVideoId = fs.readFileSync(LAST_ID_FILE, "utf8").trim();
  }

  if (latestVideoId !== lastVideoId) {
    console.log(`New video detected: ${latestTitle} (https://youtu.be/${latestVideoId})`);

    // Here you can send Slack, Discord, Email, or GitLab trigger
    // Example: Send to GitLab log
    console.log("Triggering notification...");

    // Save new ID
    fs.writeFileSync(LAST_ID_FILE, latestVideoId);
  } else {
    console.log("No new video.");
  }
}

checkYouTube();
