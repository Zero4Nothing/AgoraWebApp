var config = {
    mode: 'rtc',
    codec: 'vp8'
}

var client = AgoraRTC.createClient(config);
var options = {
    appId: null,
    channel: null,
    token: null,
    uid: null,
}
var localTracks = {
    audioTrack: null,
    videoTrack: null,
};

var remoteUsers = {};
$('#Leave').attr('disabled', true);


$('#Join').click(async function(e) {

    try {
        options.appId = $('#appId').val();
        options.channel = $('#channel').val();
        options.token = $('#token').val();
        await join();
    } catch (error) {
        console.error(error);
    } finally {
        $('#Leave').attr('disabled', false);
        $('#Join').attr('disabled', true);
    }
});

async function join() {
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnPublished);


    [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([

        client.join(options.appId, options.channel, options.token || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),

    ]);

    localTracks.videoTrack.play('local-user');
    $('#local-user-stream').text(`local-user-(${options.uid})`);
    await client.publish(Object.values(localTracks));

    console.log('Publish successfully');
    showUIButtons();





}



async function subscribe(user, mediaType) {
    const id = user.uid;
    await client.subscribe(user, mediaType);
    console.log('Subscribed successfully');
    if (mediaType === 'video') {
        const player = $(`
       <id="player-wrapper-${id}">
       <p class="player-name">remote-player-(${id})</p>
       <div id="player-${id}" class="player"></div>
       </div> 
       `);

        $('#remote-user').append(player);
        user.videoTrack.play(`player-${id}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }

}


$('#Leave').click(function(e) {
    leave();
});

async function leave() {
    for (trackName in localTracks) {
        var track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = undefined;
        }

    }

    remoteUsers = {};
    await client.leave();
    $('#remote-user').html('');
    $('#Leave').attr('disabled', true);
    $('#Join').attr('disabled', false);
    $('#local-user-stream').text('');
    console.log('Leave Successfully');
    hideUIButtons();

}


function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

function handleUserUnPublished(user) {
    const id = user.uid;
    delete remoteUsers[id];
    $(`player-wrapper-${id}`).remove();
}