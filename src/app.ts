import express from 'express';
import { connect, set } from 'mongoose';

import { errorResponder } from '@middlewares/error.middleware';

import { errorToString } from '@utils/error-to-json.util';

import { IRoute } from '@interfaces/route.interface';

class App {
    public app: express.Application;
    public env: string;
    public port: number;

    constructor(routes?: IRoute[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || 'development';
        this.port = parseInt(process.env.PORT) || 3000;


        this.initialize(routes).then();
    }

    public async run() {
        this.app.listen(this.port);

        console.info(`=====================================`);
        console.info(`           ENV: ${this.env}          `);
        console.info(`  🚀 App listening on the port ${this.port}  `);
        console.info(`=====================================`);
    }

    public async initialize(routes: IRoute[]) {
        await this.connectToDatabase();

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public async connectToDatabase() {
        try {
            const MONGO_URI = process.env.MONGO_URI;

            set('strictQuery', false);
            await connect(MONGO_URI);

            console.info(`=====================================`);
            console.info(`       🚀 Connected to Database      `);
            console.info(`=====================================`);
        } catch (error) {
            console.error(errorToString(error));
        }
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(routes: IRoute[]) {
        if (routes) {
            routes.forEach(route => {
                this.app.use('/', route.router);
            });
        }
    }

    private initializeErrorHandling() {
        this.app.use(errorResponder);
    }
}

export default App;
