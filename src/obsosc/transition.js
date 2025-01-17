const DEBUG = process.argv.includes('--enable-log')
const TEST = process.argv.includes('--unit-test')

if (TEST) {
    module.exports = { processTransition, getCurrentSceneTransition, setCurrentSceneTransition, getSceneTransitionList, getCurrentSceneTransitionDuration, setCurrentSceneTransitionDuration, getCurrentSceneTransitionCursor, setTBarPosition }
} else {
    module.exports = { processTransition, setCurrentSceneTransition, setCurrentSceneTransitionDuration, setTBarPosition }
}

async function processTransition(networks, path, args) {
    if (path[0] === undefined) {
        if (args[0] === undefined) {
            getSceneTransitionList(networks)
        } else {
            setCurrentSceneTransition(networks, args[0])
        }
        return
    }

    if (path[0] === 'current') {
        if (args[0] === undefined) {
            getCurrentSceneTransition(networks)
        } else {
            setCurrentSceneTransition(networks, args[0])
        }
    } else if (path[0] === 'duration') {
        if (args[0] === undefined) {
            getCurrentSceneTransitionDuration(networks)
        } else {
            setCurrentSceneTransitionDuration(networks, args[0])
        }
    } else if (path[0] === 'cursor') {
        if (args[0] === undefined) {
            getCurrentSceneTransitionCursor(networks)
        }
    }
}

async function getCurrentSceneTransition(networks, sendOSC = true) {
    const currentTransitionPath = '/transition/current'
    try {
        const transition = await networks.obs.call('GetCurrentSceneTransition')
        if (sendOSC) {
            try {
                networks.oscOut.send(currentTransitionPath, transition.transitionName)
            } catch (e) {
                if (DEBUG) console.error('getCurrentSceneTransition -- Failed to send current scene transition:', e)
            }
        }
        return transition
    } catch (e) {
        if (DEBUG) console.error('getCurrentSceneTransition -- Failed to get current scene transition:', e)
    }
}

async function setCurrentSceneTransition(networks, transitionName) {
    try {
        await networks.obs.call('SetCurrentSceneTransition', { transitionName })
    } catch (e) {
        if (DEBUG) console.error('setCurrentSceneTransition -- Failed to set current scene transition:', e)
    }
}

async function getSceneTransitionList(networks, sendOSC = true) {
    const transitionListPath = '/transition'
    try {
        const { transitions } = await networks.obs.call('GetSceneTransitionList')
        const transitionList = transitions.flatMap(transition => transition.transitionName)
        if (sendOSC) {
            try {
                networks.oscOut.send(transitionListPath, transitionList)
            } catch (e) {
                if (DEBUG) console.error('getSceneTransitionList -- Failed to send scene transition list:', e)
            }
        }
        return transitions
    } catch (e) {
        if (DEBUG) console.error('getSceneTransitionList -- Failed to get scene transition list:', e)
    }
}

async function getCurrentSceneTransitionDuration(networks, sendOSC = true) {
    const currentTransitionDurationPath = '/transition/duration'
    try {
        let { transitionDuration } = await networks.obs.call('GetCurrentSceneTransition')
        if (transitionDuration === null) {
            // Transitions that has fixed duration
            transitionDuration = -1
        }

        if (sendOSC) {
            try {
                networks.oscOut.send(currentTransitionDurationPath, transitionDuration)
            } catch (e) {
                if (DEBUG) console.error('getCurrentSceneTransitionDuration -- Failed to send current scene transition:', e)
            }
        }
        return transitionDuration
    } catch (e) {
        if (DEBUG) console.error('getCurrentSceneTransition -- Failed to get current scene transition:', e)
    }
}

async function setCurrentSceneTransitionDuration(networks, transitionDuration) {
    try {
        await networks.obs.call('SetCurrentSceneTransitionDuration', { transitionDuration })
    } catch (e) {
        if (DEBUG) console.error('setCurrentSceneTransitionDuration -- Failed to set current scene transition duration:', e)
    }
}

async function getCurrentSceneTransitionCursor(networks, sendOSC = true) {
    const currentTransitionCursorPath = '/transition/cursor'
    try {
        const { transitionCursor } = await networks.obs.call('GetCurrentSceneTransitionCursor')
        if (sendOSC) {
            try {
                networks.oscOut.send(currentTransitionCursorPath, transitionCursor)
            } catch (e) {
                if (DEBUG) console.error('getCurrentSceneTransitionCursor -- Failed to send current scene transition cursor:', e)
            }
        }
        return transitionCursor
    } catch (e) {
        if (DEBUG) console.error('getCurrentSceneTransitionCursor -- Failed to get current scene transition cursor:', e)
    }
}

// Note: Will be deprecated later due to API change
async function setTBarPosition(networks, position, release = true) {
    try {
        await networks.obs.call('SetTBarPosition', { position, release })
    } catch (e) {
        if (DEBUG) console.error('setTBarPosition -- Failed to set TBar position:', e)
    }
}
