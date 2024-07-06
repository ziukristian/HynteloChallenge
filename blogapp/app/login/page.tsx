"use client";
import { showNotification } from "@mantine/notifications";
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from "@mantine/form";
import { Button, Group, TextInput, NumberInput, Container, Center, Paper, Switch } from "@mantine/core";
import Cookies from "js-cookie";

export default function Login() {
    const form = useForm({
        mode: "controlled",
        initialValues: { username: "", password: "", remember: false },
        validate: {
            username: hasLength({ min: 1 }, "Username is missing"),
            password: hasLength({ min: 1 }, "Password is missing"),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        if (!form.isValid) {
            return;
        }
        if (values.username === "admin" && values.password === "admin") {
            if (values.remember) {
                Cookies.set("bloguser", values.username, { expires: 7 });
            } else {
                Cookies.set("bloguser", values.username);
            }
            showNotification({ message: "Logged in successfully", color: "green", title: "Success" });
            window.location.replace("/");
            return;
        } else {
            showNotification({ message: "Invalid username or password", color: "red", title: "Error" });
        }
    };

    return (
        <Container fluid pt={100}>
            <Center>
                <Paper shadow="md" p="xl">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput {...form.getInputProps("username")} label="Username" placeholder="" />
                        <TextInput {...form.getInputProps("password")} label="Password" placeholder="" />
                        <Switch {...form.getInputProps("remember")} label="Remember me" mt="md" />
                        <Button type="submit" mt="md">
                            Login
                        </Button>
                    </form>
                </Paper>
            </Center>
        </Container>
    );
}
