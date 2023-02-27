import { errorToString } from '@utils/error-to-json.util';

import App from './app';
import PostRoute from '@domain/post/post.route';
import UserRoute from '@domain/user/user.route';

const app = new App([
  new PostRoute(),
  new UserRoute()
]);

app.run();

process.on('uncaughtException', error => {
    console.error(errorToString(error));
});

process.on('unhandledRejection', error => {
    console.error(error);
});
