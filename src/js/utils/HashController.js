define(["dojo/hash", "dojo/topic", "dojo/_base/lang", "dojo/io-query", "dojo/_base/array", "utils/HashController", 'main/config'],
    function(hash, topic, lang, ioQuery, arrayUtil, HashController, Config) {


        var o = {};
        var currentState = {};
        o.newState = {};

        o.init = function() {
            var that = this;

            var _initialState;
            var url = window.location.href;
            var hasHash = (url.split("#").length == 2 && url.split("#")[1].length > 1);

            if (hasHash) {
                _initialState = ioQuery.queryToObject(url.split("#")[1]);
            } else {
                _initialState = Config.defaultState;
            }
            topic.subscribe("/dojo/hashchange", function(changedHash) {
                var newAppState = ioQuery.queryToObject(changedHash);
                var oldAppState = currentState;

                that.handleHashChange(newAppState, oldAppState);

            });

            //push the app state initially
            that.updateHash(_initialState);

        };

        o.handleHashChange = function(newState, oldState) {
            var that = this;

            o.newState = newState;

            var changedView = oldState.v != newState.v;
            var mapView = newState.v == "map";
            var centerChange = ((oldState.x != newState.x) || (oldState.y != newState.y) || (oldState.y != newState.y));

            currentState = newState; //important

        };


        o.updateHash = function(updateState) {

            var that = this;


            //merge with current hash (newState)
            var _currentState = lang.clone(currentState);

            lang.mixin(_currentState, updateState);


            var newHashStr = ioQuery.objectToQuery(_currentState);

            hash(newHashStr);

        };

        o.getHash = function() {
            return ioQuery.queryToObject(hash());
        };

        return o;


    });
