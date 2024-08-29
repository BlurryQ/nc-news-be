const app = require("./db/connection");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`listening on ${PORT}...`));
