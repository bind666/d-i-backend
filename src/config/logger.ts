const logger = {
    info: (msg: string) => console.log(`✅ INFO: ${msg}`),
    error: (msg: string | Error) => console.error(`❌ ERROR: ${msg}`),
};

export default logger;
