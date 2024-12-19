import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }
  
    // Access the `users` table in db.json
    const users = router.db.get("users").value();
  
    // Find the user with the matching username and password
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  
    // If user exists, send success response with user data (e.g., token)
    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, isAuthenticated: 1 },
    });
  });

server.use(router);

server.listen(5000, () => {
  console.log("JSON Server is running on http://localhost:5000");
});
