'use strict';

/**
 * IccHelper redirect calls to ICC related APIs to correct object. IccHelper is
 * created for backward compatibility of gaia master after the patches of
 * bug 860585, 874744, and 875721 landed in m-c. In those patches icc related
 * events and attributes are moved from mozMobileConnection to mozIccManager.
 * The helper *SHOULD* be removed once all gaia developement no longer depend
 * on b2g18.
 */

var IccHelper = (function() {
  var mobileConn = navigator.mozMobileConnection;
  var iccManager = null;

  if (mobileConn) {
    iccManager = navigator.mozIccManager || mobileConn.icc;

    var actors = {
      'cardLock': null,
      'cardState': null,
      'iccInfo': null
    };

    if ('setCardLock' in mobileConn) {
      actors['cardLock'] = mobileConn;
    } else if ('setCardLock' in iccManager) {
      actors['cardLock'] = iccManager;
    }

    if ('cardState' in mobileConn) {
      actors['cardState'] = mobileConn;
    } else if ('cardState' in iccManager) {
      actors['cardState'] = iccManager;
    }

    if ('iccInfo' in mobileConn) {
      actors['iccInfo'] = mobileConn;
    } else if ('iccInfo' in iccManager) {
      actors['iccInfo'] = iccManager;
    }
  }

  return {
    get enabled() {
      return (iccManager !== null);
    },

    addEventListener: function icch_addEventListener() {
      var eventName = arguments[0];
      switch (eventName) {
        case 'cardstatechange':
          var actor = actors['cardState'];
          return actor.addEventListener.apply(actor, arguments);
        case 'iccinfochange':
          var actor = actors['iccInfo'];
          return actor.addEventListener.apply(actor, arguments);
        case 'icccardlockerror':
          var actor = actors['cardLock'];
          return actor.addEventListener.apply(actor, arguments);
      }
    },

    removeEventListener: function icch_removeEventListener() {
      var eventName = arguments[0];
      switch (eventName) {
        case 'cardstatechange':
          var actor = actors['cardState'];
          return actor.removeEventListener.apply(actor, arguments);
        case 'iccinfochange':
          var actor = actors['iccInfo'];
          return actor.removeEventListener.apply(actor, arguments);
        case 'icccardlockerror':
          var actor = actors['cardLock'];
          return actor.removeEventListener.apply(actor, arguments);
      }
    },

    getCardLock: function icch_getCardLock() {
      var actor = actors['cardLock'];
      return actor.getCardLock.apply(actor, arguments);
    },

    setCardLock: function icch_setCardLock() {
      var actor = actors['cardLock'];
      return actor.setCardLock.apply(actor, arguments);
    },

    unlockCardLock: function icch_unlockCardLock() {
      var actor = actors['cardLock'];
      return actor.unlockCardLock.apply(actor, arguments);
    },

    get cardState() {
      var actor = actors['cardState'];
      return actor.cardState;
    },

    get iccInfo() {
      var actor = actors['iccInfo'];
      return actor.iccInfo;
    },

    set oncardstatechange(callback) {
      var actor = actors['cardState'];
      actor.oncardstatechange = callback;
    },

    set oniccinfochange(callback) {
      var actor = actors['iccInfo'];
      actor.oniccinfochange = callback;
    },

    set onicccardlockerror(callback) {
      var actor = actors['cardLock'];
      actor.onicccardlockerror = callback;
    }
  };
})();
