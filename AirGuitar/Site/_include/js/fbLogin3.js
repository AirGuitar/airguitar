angular.module('CiulApp', ['facebook', 'firebase'])

.config([
    'FacebookProvider',
    function(FacebookProvider) {
        var myAppId = '1546114282338793';

        // You can set appId with setApp method
        // FacebookProvider.setAppId('myAppId');

        /**
         * After setting appId you need to initialize the module.
         * You can pass the appId on the init method as a shortcut too.
         */
        FacebookProvider.init(myAppId);

    }
])

.controller('MainController', [
    '$scope',
    '$timeout',
    'Facebook',
    function($scope, $timeout, Facebook) {

        // Define user empty data :/
        $scope.user = {};

        // Define img
        $scope.image = "";

        // Defining user logged status
        $scope.logged = false;

        // And some fancy flags to display messages upon user status change
        $scope.byebye = false;
        $scope.salutation = false;






        /**
         * Watch for Facebook to be ready.
         * There's also the event that could be used
         */
        $scope.$watch(
            function() {
                return Facebook.isReady();
            },
            function(newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        var userIsConnected = false;

        Facebook.getLoginStatus(function(response) {

            if (response.status == 'connected') {
                userIsConnected = true;
                $scope.$apply(function() {
                    $scope.userIsConnected = true;
                    $scope.logged = true;

                });
            }
        });

        /**
         * IntentLogin
         */
        $scope.IntentLogin = function() {
            if (!userIsConnected) {
                $scope.login();

            }
        };

        /**
         * Login
         */
        $scope.login = function() {
            Facebook.login(function(response) {
                if (response.status == 'connected') {
                    $scope.logged = true;
                    $scope.me();
                    $scope.picture();
                }

            });
        };

        /**
         * me
         */
        $scope.me = function() {
            Facebook.api('/me', function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function() {
                    $scope.user = response;
                });

            });
        };

        /**
         * me
         */
        $scope.picture = function() {
            Facebook.api('/me/picture', {
                    "redirect": false,
                    "height": 200,
                    "width": 200,
                    "type": "normal"
                },
                function(response) {
                    if (response && !response.error) {
                        /* handle the result */
                        $scope.$apply(function() {
                            $scope.image = response.data.url;
                        });
                    }
                });
        };

        /**
         * Logout
         */
        $scope.logout = function() {
            Facebook.logout(function() {
                $scope.$apply(function() {
                    $scope.user = {};
                    $scope.logged = false;
                });
                window.location.reload()
            });
        }

        /**
         * Taking approach of Events :D
         */
        $scope.$on('Facebook:statusChange', function(ev, data) {
            console.log('Status: ', data);
            if (data.status == 'connected') {
                $scope.$apply(function() {
                    $scope.me();
                    $scope.picture();
                });
            } else {
                $scope.$apply(function() {


                    // Dismiss byebye message after two seconds
                    $timeout(function() {
                        $scope.logout();
                    }, 500000000);
                });
            }


        });


    }
])

.controller('subscriptionController', ['$scope', '$firebase', '$rootScope', '$location',
    function($scope, $firebase, $rootScope, $location) {

        //extract subscription id from url
        //ex.) https://airguitar.herokuapp.com/app.html?token=EC-1LW33499VX4122816
        $rootScope.location = $location;
        console.log($rootScope.location);

        //store subscription
        $scope.newSubscription = {};
        var theFirebaseURL = "https://airguitar-subscriptions.firebaseio.com/";
        var ref = new Firebase(theFirebaseURL);

        $scope.messages = $firebase(ref.child("subscriptions")).$asArray();

        /*
        $scope.save = function() {

            $scope.messages.$add($scope.newMsg);
        };
        */
    }
])

/**
 * Just for debugging purposes.
 * Shows objects in a pretty way
 */
.directive('debug', function() {
    return {
        restrict: 'E',
        scope: {
            expression: '=val'
        },
        template: '<pre>{{debug(expression)}}</pre>',
        link: function(scope) {
            // pretty-prints
            scope.debug = function(exp) {
                return angular.toJson(exp, true);
            };
        }
    }
})