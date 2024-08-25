export const register = (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
}

export const login = (req, res) => res.send("login");