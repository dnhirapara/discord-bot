var axios = require('axios');

exports.CreateBroadCast = async ({
    title = "",
    description = "",
    scheduledStartTime = new Date().toISOString(),
    scheduledEndTime = "",
    enableAutoStop = "",
    enableEmbed = "",
    boundStreamId = "",
    recordFromStart = "",
    privacyStatus = "unlisted",
    selfDeclaredMadeForKids = true,
    access_token }
) => {
    // var data = JSON.stringify({
    //     snippet: {
    //         title,
    //         description,
    //         scheduledStartTime,
    //         scheduledEndTime,
    //     },
    //     contentDetails: {
    //         enableDvr: "",
    //         recordFromStart: "",
    //         startWithSlate: "",
    //         enableAutoStart: "",
    //         enableAutoStop,
    //         enableEmbed,
    //         boundStreamId,
    //         recordFromStart,
    //     },
    //     status: {
    //         privacyStatus,
    //         selfDeclaredMadeForKids,
    //     },
    // });
    var data = JSON.stringify({
        "snippet": {
            "scheduledStartTime": scheduledStartTime,
            "title": title
        },
        "status": {
            "privacyStatus": "unlisted"
        },
        "contentDetails": {}
    });
    console.log(data);
    console.log(access_token);
    console.log(process.env.API_KEY);
    var config = {
        method: 'post',
        url: `https://youtube.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,contentDetails,status&key=${process.env.API_KEY}&access_token=${access_token}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    // axios(config)
    //     .then(function (response) {
    //         console.log(response.data);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    try {
        const response = await axios(config);
        console.log(response);
        return response.data;
    } catch (e) {
        return "ERROR: " + e;
    }
};