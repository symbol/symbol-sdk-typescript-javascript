import request from 'request'

export class WebClient {

    private constructor() {

    };

    public static async request(content: string, options: request.Options) {

        const contentBuf = new Buffer(content);
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Content-Length'] = contentBuf.byteLength;

        return await WebClient.httpRequest(contentBuf, options);
    };

    private static async httpRequest(content: Buffer, options: request.Options) {
        let isCalled = false;
        return new Promise((resolve, reject) => {
            const req = request(options, (err, res, body) => {
                if (isCalled) {
                    return console.error(null, "Multiple requests");
                }
                isCalled = true;
                if (err) {
                    reject(err);
                }
                resolve(body)
            });
            req.write(content);
            req.end();
        });
    }
}
