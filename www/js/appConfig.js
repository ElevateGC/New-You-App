(function () {
    'use strict';

    angular
        .module("NewYou")
        .constant('appConfig', {
            YouTubeAPIKey: 'AIzaSyCMEpsJej_aAhAQa3kGo_-m6q3OREGDOYM',
            appName: 'New YOU App',
            appVersion: 'X.X',
            ChannelUsernames:'VideoStationBRNY:Barney',
            webApiRoot: 'https://www.googleapis.com/youtube/v3/'

        });
}());