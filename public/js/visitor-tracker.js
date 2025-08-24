/**
 * Visitor Tracking Script for Store Analytics
 * This script tracks visitor behavior on store websites
 */
(function() {
    'use strict';
    
    // Configuration
    const config = {
        apiBaseUrl: window.location.origin + '/api/v1/visitor',
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        heartbeatInterval: 30 * 1000, // 30 seconds
        trackScrollDepth: true,
        trackClicks: true,
        trackPageViews: true,
        debugMode: false
    };

    // State management
    let sessionData = {
        sessionId: null,
        startTime: null,
        lastActivity: null,
        pageViews: 0,
        totalScrollDepth: 0,
        maxScrollDepth: 0,
        clicks: 0,
        timeOnPage: 0
    };

    // Utility functions
    const utils = {
        log: function(message, data = null) {
            if (config.debugMode) {
                console.log('[VisitorTracker]', message, data);
            }
        },

        generateSessionId: function() {
            return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        getCookie: function(name) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            if (parts.length === 2) {
                return parts.pop().split(";").shift();
            }
            return null;
        },

        setCookie: function(name, value, days = 1) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
        },

        getScrollDepth: function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            return Math.round((scrollTop + windowHeight) / documentHeight * 100);
        },

        getDeviceInfo: function() {
            const ua = navigator.userAgent;
            let deviceType = 'desktop';
            
            if (/tablet|ipad|playbook|silk/i.test(ua)) {
                deviceType = 'tablet';
            } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
                deviceType = 'mobile';
            }

            return {
                deviceType,
                userAgent: ua,
                screen: {
                    width: screen.width,
                    height: screen.height
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
        },

        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = function() {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // API functions
    const api = {
        sendData: function(endpoint, data) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', config.apiBaseUrl + endpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            
            // Add CSRF token if available
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (csrfToken) {
                xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken.getAttribute('content'));
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        utils.log('Data sent successfully', { endpoint, data });
                    } else {
                        utils.log('Failed to send data', { status: xhr.status, endpoint });
                    }
                }
            };

            try {
                xhr.send(JSON.stringify(data));
            } catch (error) {
                utils.log('Error sending data', error);
            }
        },

        trackPageView: function() {
            const data = {
                sessionId: sessionData.sessionId,
                url: window.location.href,
                referrer: document.referrer,
                title: document.title,
                timestamp: Date.now(),
                deviceInfo: utils.getDeviceInfo()
            };

            this.sendData('/pageview', data);
            sessionData.pageViews++;
            utils.log('Page view tracked', data);
        },

        trackSession: function() {
            const now = Date.now();
            const data = {
                sessionId: sessionData.sessionId,
                duration: now - sessionData.startTime,
                pageViews: sessionData.pageViews,
                maxScrollDepth: sessionData.maxScrollDepth,
                clicks: sessionData.clicks,
                url: window.location.href,
                timestamp: now
            };

            this.sendData('/session', data);
            utils.log('Session data tracked', data);
        },

        trackEvent: function(eventType, data = {}) {
            const eventData = {
                sessionId: sessionData.sessionId,
                eventType,
                url: window.location.href,
                timestamp: Date.now(),
                ...data
            };

            this.sendData('/event', eventData);
            utils.log('Event tracked', eventData);
        }
    };

    // Event handlers
    const handlers = {
        initSession: function() {
            // Check for existing session
            const existingSessionId = utils.getCookie('visitor_session');
            const lastActivity = parseInt(utils.getCookie('visitor_last_activity') || '0');
            const now = Date.now();

            if (existingSessionId && (now - lastActivity) < config.sessionTimeout) {
                // Continue existing session
                sessionData.sessionId = existingSessionId;
                sessionData.startTime = parseInt(utils.getCookie('visitor_session_start') || now);
            } else {
                // Start new session
                sessionData.sessionId = utils.generateSessionId();
                sessionData.startTime = now;
                utils.setCookie('visitor_session_start', sessionData.startTime);
            }

            sessionData.lastActivity = now;
            utils.setCookie('visitor_session', sessionData.sessionId);
            utils.setCookie('visitor_last_activity', now);

            utils.log('Session initialized', sessionData);
        },

        trackScroll: utils.debounce(function() {
            const scrollDepth = utils.getScrollDepth();
            sessionData.maxScrollDepth = Math.max(sessionData.maxScrollDepth, scrollDepth);
            sessionData.lastActivity = Date.now();
            utils.setCookie('visitor_last_activity', sessionData.lastActivity);
        }, 1000),

        trackClick: function(event) {
            sessionData.clicks++;
            sessionData.lastActivity = Date.now();
            utils.setCookie('visitor_last_activity', sessionData.lastActivity);

            // Track specific click data
            const clickData = {
                elementType: event.target.tagName.toLowerCase(),
                elementId: event.target.id || null,
                elementClass: event.target.className || null,
                elementText: event.target.textContent ? event.target.textContent.substring(0, 100) : null,
                x: event.clientX,
                y: event.clientY
            };

            api.trackEvent('click', clickData);
        },

        trackVisibilityChange: function() {
            if (document.hidden) {
                // Page became hidden - send session data
                api.trackSession();
            } else {
                // Page became visible - update last activity
                sessionData.lastActivity = Date.now();
                utils.setCookie('visitor_last_activity', sessionData.lastActivity);
            }
        },

        trackBeforeUnload: function() {
            // Send final session data before page unload
            api.trackSession();
        },

        sendHeartbeat: function() {
            const now = Date.now();
            if ((now - sessionData.lastActivity) < config.sessionTimeout) {
                api.trackSession();
            }
        }
    };

    // Initialization
    function init() {
        // Initialize session
        handlers.initSession();

        // Track initial page view
        if (config.trackPageViews) {
            api.trackPageView();
        }

        // Set up event listeners
        if (config.trackScrollDepth) {
            window.addEventListener('scroll', handlers.trackScroll, { passive: true });
        }

        if (config.trackClicks) {
            document.addEventListener('click', handlers.trackClick, true);
        }

        // Visibility API for tab switching
        document.addEventListener('visibilitychange', handlers.trackVisibilityChange);

        // Before unload - send final data
        window.addEventListener('beforeunload', handlers.trackBeforeUnload);

        // Heartbeat to keep session alive and send periodic updates
        setInterval(handlers.sendHeartbeat, config.heartbeatInterval);

        // Handle page navigation (for SPAs)
        let currentUrl = window.location.href;
        setInterval(function() {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                if (config.trackPageViews) {
                    api.trackPageView();
                }
            }
        }, 1000);

        utils.log('Visitor tracking initialized');
    }

    // Public API
    window.VisitorTracker = {
        init: init,
        trackEvent: api.trackEvent,
        getSessionData: function() {
            return { ...sessionData };
        },
        setConfig: function(newConfig) {
            Object.assign(config, newConfig);
        }
    };

    // Auto-initialize if not in debug mode
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();