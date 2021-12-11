var axios = require('axios');

exports.CreateBroadCast = async ({
    title = "",
    description = "",
    scheduledStartTime = new Date().toISOString(),
    scheduledEndTime = new Date().toISOString(),
    enableAutoStart = true,
    boundStreamId = "",
    privacyStatus = "unlisted",
    selfDeclaredMadeForKids = true,
    access_token }
) => {
    var data = JSON.stringify({
        snippet: {
            title,
            description,
            scheduledStartTime,
            scheduledEndTime,
        },
        contentDetails: {
            enableAutoStart,
            boundStreamId,
        },
        status: {
            privacyStatus,
            selfDeclaredMadeForKids,
        },
    });
    console.log(data);
    var config = {
        method: 'post',
        url: `https://youtube.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,contentDetails,status&key=${process.env.API_KEY}&access_token=${access_token}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const response = await axios(config);
        return response.data;
    } catch (e) {
        return "ERROR: " + e;
    }
};