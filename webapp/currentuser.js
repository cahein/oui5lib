jQuery.sap.require("oui5lib.configuration");
jQuery.sap.require("oui5lib.request");

jQuery.sap.declare("oui5lib.currentuser");

(function () {
    "use strict";

    /** @namespace oui5lib.currentuser */
    var user = oui5lib.namespace("currentuser"),
    _name = null,
    _userId = null,
    _token = null,
    _userRoles = [],
    _permissionsMap = null;


    /**
     * Get the user's name
     * @function getName
     * @memberof oui5lib.currentuser
     * @returns {string} the user's firstname lastname)
     */
    function getName() {
        return _name;
    }

    /**
     * Get the user's uniquename from the currentProfile.
     * @function getUniquename
     * @memberof oui5lib.currentuser
     * @returns {string} the user's uniquename
     */
    function getUserId() {
        return _userId;
    }

    function hasPermissionForView(viewName) {
        if (_permissionsMap === null) {
            return false;
        }
        if (typeof _permissionsMap.views[viewName] !== "undefined") {
            var viewRoles = _permissionsMap.views[viewName].roles;
            return hasPermissions(viewRoles);
        }
        return true;
    }

    /**
     * Test, if the user has permissions.
     * @function hasPermissions
     * @memberof oui5lib.currentuser
     * @param {array} userRoles The required user role names.
     * @returns {boolean}
     */
    function hasPermissions(authorizedRoles) {
        if (typeof authorizedRoles === "undefined" ||
            !(authorizedRoles instanceof Array)) {
            return false;
        }

        var authorized = false,
            i, s;

        for (i = 0, s = authorizedRoles.length; i < s; i++) {
            if (hasRole(authorizedRoles[i])) {
                authorized = true;
                break;
            }
        }
        return authorized;
    }

    /**
     * Test, if the user has the specified user role.
     * @function hasUserRole
     * @memberof oui5lib.currentuser
     * @param {string} role The role name.
     * @returns {boolean}
     */
    function hasRole(role) {
        return _userRoles.indexOf(role) > -1;
    }

    
    /**
     * Initialize the current user object.
     */
    function init() {
        var userProfileUrl = oui5lib.configuration.getUserProfileUrl();
        if (userProfileUrl !== null) {
            requestUserProfile(userProfileUrl);
        }
        
        oui5lib.request.loadJson("permissions.json",
                                 permissionsMapRequestSucceeded,
                                 {}, false);
    }

    /**
     * Requests user authorization and profile.
     */
    function requestUserProfile(userProfileUrl) {
        oui5lib.request.loadJson(userProfileUrl,
                                 userProfileRequestSucceeded,
                                 {}, false);
    }

    function userProfileRequestSucceeded(userProfile) {
        if (userProfile !== null) {
            _name = userProfile.firstname + " " + userProfile.lastname;
            _userId = userProfile.userId;
            _token = userProfile.token;

            if (userProfile.roles instanceof Array) {
                _userRoles = userProfile.roles;
            }
        }
    }

    function permissionsMapRequestSucceeded(permissionsMap) {
        _permissionsMap = permissionsMap;
    }

    user.init = init;

    user.getName = getName;
    user.getUserId = getUserId;

    user.hasRole = hasRole;
    user.hasPermissionForView = hasPermissionForView;
}());
