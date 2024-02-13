$('.videoCamerIcon').click(function(e) {
    if ($(this).hasClass('fa-video-camera')) {
        $(this).addClass('fa-video-slash');
        $(this).removeClass('fa-video-camera');
        $(this).css('color', 'red');
        localTracks.videoTrack.setEnabled(false);
    } else {
        $(this).addClass('fa-video-camera');
        $(this).removeClass('fa-video-slash');
        $(this).css('color', 'black');
        localTracks.videoTrack.setEnabled(true);
    }

});

$('.microPhoneIcon').click(function(e) {
    if ($(this).hasClass('fa-microphone')) {
        $(this).addClass('fa-microphone-slash');
        $(this).removeClass('fa-microphone')
        $(this).css('color', 'red');
        localTracks.audioTrack.setEnabled(false);

    } else {
        $(this).addClass('fa-microphone');
        $(this).removeClass('fa-microphone-slash');
        $(this).css('color', 'black');
        localTracks.audioTrack.setEnabled(true);


    }

});

function hideUIButtons() {
    $('.UI_Buttons').css('visibility', 'hidden');
}
hideUIButtons();

function showUIButtons() {
    $('.UI_Buttons').css('visibility', 'visible');
}