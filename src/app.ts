import { json } from "body-parser";
import express, { urlencoded } from "express";
import expressValidator from "express-validator";
import helmet from "helmet";
import morgan from "morgan";
import { join } from "path";
import { router } from "./router";
import logger from "./util/logger";

const app = express();

// Set running port form environment
app.set("port", process.env.PORT || 3000);

// Static file
app.use(express.static(join(__dirname, "../public")));

// Middleware for secure server
app.use(helmet());

// Decode middleware body from client
app.use(json());
app.use(urlencoded({ extended: true }));

// Middleware used to validate request
app.use(expressValidator());

// Logger for express
app.use(
    morgan("dev", {
        stream: {
            write(text: string) {
                logger.info(text);
            },
        },
    }),
);

app.use((_, res, next) => {
    // Allow access from other domain
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
});

app.use(router);

export default app;
