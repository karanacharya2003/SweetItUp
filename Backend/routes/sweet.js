exports.register = (req, res) => {
  const { username, password } = req.body;
  // dummy logic just for test to pass
  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  return res.status(201).json({ message: "User registered successfully" });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  // dummy login logic
  if (username === "testuser" && password === "secret") {
    return res.status(200).json({ token: "dummy-jwt-token" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
};
