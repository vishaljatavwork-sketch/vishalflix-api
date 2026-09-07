const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/stream', async (req, res) => {
    const { id, title, isTv } = req.query;
    const tmdbId = id || "634649";

    try {
        const streamSources = [
            `https://autoembed.cc/api/getVideoSource?id=${tmdbId}${isTv === 'true' ? '&s=1&e=1' : ''}`,
            `https://vidsrc.stream/api/source/${tmdbId}`
        ];

        let videoUrl = null;

        for (const source of streamSources) {
            try {
                const response = await axios.get(source, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 4000
                });

                if (response.data && response.data.videoUrl) {
                    videoUrl = response.data.videoUrl;
                    break;
                }
                if (response.data && response.data.sources && response.data.sources.length > 0) {
                    videoUrl = response.data.sources[0].url;
                    break;
                }
            } catch (err) {
                // अगला सोर्स आज़माएगा
            }
        }

        if (!videoUrl) {
            videoUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
        }

        return res.json({
            success: true,
            streamUrl: videoUrl
        });

    } catch (error) {
        return res.json({
            success: true,
            streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        });
    }
});

module.exports = app;
