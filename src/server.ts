import "dotenv/config";
import app from "./app"

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Listening on port ${port}`);
});