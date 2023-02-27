export const errorToString = (error: Error): string => {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
};
