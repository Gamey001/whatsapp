const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Transcodes any audio file to MP3 for universal browser playback.
 * Returns the new filename (e.g. "abc123.mp3").
 * Deletes the original file on success.
 */
const transcodeToMp3 = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.[^.]+$/, ".mp3");
    ffmpeg(inputPath)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .output(outputPath)
      .on("end", () => {
        // Remove original file
        fs.unlink(inputPath, () => {});
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
};

module.exports = { transcodeToMp3 };
