// code away!
const server = require("./server.js");
const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
