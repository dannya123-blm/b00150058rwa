"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    AppBar,
    Toolbar,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

// Function to escape HTML characters to prevent XSS attacks
const escapeInput = (input) => {
    return input.replace(/[&<>"']/g, (match) => {
        const escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };
        return escapeMap[match];
    });
};

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [naughtyStrings, setNaughtyStrings] = useState([]); // Dynamically fetched BLNS
    const router = useRouter();

    // Fetch the Big List of Naughty Strings on mount
    useEffect(() => {
        const fetchNaughtyStrings = async () => {
            try {
                const response = await fetch(
                    "https://raw.githubusercontent.com/minimaxir/big-list-of-naughty-strings/master/blns.json"
                );
                if (response.ok) {
                    const data = await response.json();
                    setNaughtyStrings(data);
                } else {
                    console.error("Failed to fetch naughty strings.");
                }
            } catch (error) {
                console.error("Error fetching naughty strings:", error);
            }
        };

        fetchNaughtyStrings();
    }, []);

    // **Validation Rules**
    const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,30}$/.test(username);
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidPassword = (password) => password.length >= 8 && password.length <= 30;

    // Check input against naughty strings
    const containsNaughtyString = (input) => {
        return (
            naughtyStrings.length > 0 &&
            naughtyStrings.some((str) => input.includes(str))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // **Field-Specific Validation**
        if (!username.trim() || !email.trim() || !password.trim()) {
            setMessage("All fields are required.");
            setMessageColor("red");
            return;
        }

        if (!isValidUsername(username)) {
            setMessage(
                "Invalid username. Only alphanumeric characters and underscores are allowed (3-30 chars)."
            );
            setMessageColor("red");
            return;
        }

        if (!isValidEmail(email)) {
            setMessage("Invalid email format.");
            setMessageColor("red");
            return;
        }

        if (!isValidPassword(password)) {
            setMessage("Password must be between 8 and 30 characters.");
            setMessageColor("red");
            return;
        }

        // **Naughty Strings Validation**
        if (
            containsNaughtyString(username) ||
            containsNaughtyString(email) ||
            containsNaughtyString(password)
        ) {
            setMessage("Input contains invalid or forbidden characters.");
            setMessageColor("red");
            return;
        }

        // Escape input to prevent XSS
        const escapedUsername = escapeInput(username.trim());
        const escapedEmail = escapeInput(email.trim());
        const escapedPassword = escapeInput(password.trim());

        // Submit the data to the server
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: escapedUsername,
                    email: escapedEmail,
                    password: escapedPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Registration successful.");
                setMessageColor("green");
                setUsername("");
                setEmail("");
                setPassword("");
            } else {
                setMessage(data.message || "Registration failed.");
                setMessageColor("red");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            setMessageColor("red");
        }
    };

    return (
        <Box
            className="customer-dashboard"
            sx={{
                background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                minHeight: "100vh",
            }}
        >
            <AppBar
                position="static"
                className="customer-appbar"
                sx={{ background: "linear-gradient(45deg, #1A237E, #2196F3)" }}
            >
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Register
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xs" sx={{ mt: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        backgroundColor: "#fff",
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.slice(0, 30))}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        required
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        required
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.slice(0, 30))}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, background: "linear-gradient(45deg, #2196F3, #21CBF3)" }}
                    >
                        Register
                    </Button>
                    {message && (
                        <Typography sx={{ mt: 2, color: messageColor }}>{message}</Typography>
                    )}
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => router.push("/login")}
                    >
                        Already have an account? Login
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
