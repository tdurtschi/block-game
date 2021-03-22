class InvalidActionError extends Error {
    constructor(public message: string) {
        super();
    }
}

export default InvalidActionError;