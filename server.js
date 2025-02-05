import jsonServer from "json-server";
import { v4 as uuidv4 } from "uuid";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  // Access the `users` table in db.json
  const users = router.db.get("users").value();

  // Find the user with the matching username and password
  const user = users.find(
    (user) => user.username === username && user.password === password,
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

server.post("/api/cruises", (req, res) => {
  const { data } = req.body;
  const { cruise, stations, user } = data;

  // Validate presence of cruise and stations
  if (!cruise || !stations) {
    return res
      .status(400)
      .json({ error: "Cruise and stations data are required." });
  }

  // Validate presence of user
  if (!user || !user.id) {
    return res
      .status(400)
      .json({ error: "Authenticated user information is required." });
  }

  const db = router.db; // Lowdb instance

  // Check if cruise ID already exists
  const existingCruise = db.get("cruises").find({ id: cruise.id }).value();
  if (existingCruise && cruise.cruiseStatusId !== 4) {
    return res.status(400).json({ error: "Cruise ID already exists." });
  }

  // Determine if it's a new cruise or a previously rejected cruise
  if (cruise.cruiseStatusId === 4) { // if rejected
    cruise.cruiseStatusId = 3; // Set status to submitted
  } else if ([1, 2].includes(cruise.cruiseStatusId)) {
    // New cruise: Validate cruiseStatusId and set to '3'
    cruise.cruiseStatusId = 3;
  } else {
    // Invalid cruiseStatusId
    return res
      .status(400)
      .json({ error: "Invalid cruiseStatusId. Must be 1, 2, or 4." });
  }

  // Validate each station's cruiseId matches cruise.id
  for (const station of stations) {
    if (station.cruiseId !== cruise.id) {
      return res
        .status(400)
        .json({ error: `Station ID ${station.id} has mismatched cruiseId.` });
    }
  }

  // Save cruise to the database
  db.get("cruises").push(cruise).write();

  // Save each station to the database
  stations.forEach((station) => {
    db.get("stations").push(station).write();
  });

  // Associate cruise.id with the user in 'userCruises'
  let userCruisesEntry = db.get("userCruises").find({ id: user.id }).value();

  if (!userCruisesEntry) {
    // If userCruises entry doesn't exist, create it
    userCruisesEntry = {
      id: user.id,
      cruises: [cruise.id],
    };
    db.get("userCruises").push(userCruisesEntry).write();
  } else {
    // If cruise.id isn't already associated, add it
    if (!userCruisesEntry.cruises.includes(cruise.id)) {
      db.get("userCruises")
        .find({ id: user.id })
        .get("cruises")
        .push(cruise.id)
        .write();
    }
  }

  return res.status(201).json({
    message: "Cruise and stations created successfully.",
    cruise,
    stations,
  });
});

server.use(router);

server.listen(5000, () => {
  console.log("JSON Server is running on http://localhost:5000");
});
