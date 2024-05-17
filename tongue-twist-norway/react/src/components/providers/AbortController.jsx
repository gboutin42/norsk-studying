function AbortControllerSignal(callbacks) {
    const controller = new AbortController()
    const signal = controller.signal

    callbacks.forEach(callback => {
        callback(signal)
    });

    return () => {
        controller.abort()
    }
}

export default AbortControllerSignal;