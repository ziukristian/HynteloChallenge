"use client";
import { AppShell, Center, Container, Stack, Flex, Avatar, Skeleton, Card, TextInput, Textarea, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from "@mantine/form";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Post from "../../types/Post";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
    const [user, setUser] = useState("user");
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<Post>();

    const router = useRouter();

    const form = useForm({
        mode: "controlled",
        initialValues: { postBody: "", postTitle: "" },
        validate: {
            postTitle: hasLength({ min: 1 }, "Post title is missing"),
            postBody: hasLength({ min: 1 }, "Post body is missing"),
        },
    });

    var userid = null;
    useEffect(() => {
        const user = Cookies.get("bloguser");
        userid = localStorage.getItem("bloguserid");
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);

    const handleBackClick = () => {
        router.push(`/`);
    };

    const handleSubmit = (values: typeof form.values) => {
        if (!form.isValid) {
            return;
        }

        let newPost: Post = {
            id: 0,
            title: values.postTitle,
            body: values.postBody,
            author: user,
            comments: [],
        };

        axios
            .post("http://localhost:8080/posts", newPost)
            .then((data) => {
                showNotification({ message: "Post created successfully", color: "green", title: "Success" });
                router.push(`/`);
            })
            .catch((error) => {
                showNotification({ message: error.response.data, color: "red", title: "Error" });
            })
            .finally(() => {});
    };

    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Container fluid>
                    <Flex h={60} gap="md" justify="flex-end" align="center" direction="row" wrap="nowrap">
                        <Avatar color="cyan" radius="xl">
                            {user.slice(0, 2).toUpperCase()}
                        </Avatar>
                    </Flex>
                </Container>
            </AppShell.Header>

            <AppShell.Main>
                <main>
                    {loading ? (
                        <>
                            <Skeleton height={100} mt={6} radius="xl" />
                        </>
                    ) : (
                        <>
                            <div className="w-full flex justify-start items-start">
                                <Button onClick={() => handleBackClick()} mt="md">
                                    Go Back
                                </Button>
                            </div>
                            <br />
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <form onSubmit={form.onSubmit(handleSubmit)}>
                                    <TextInput {...form.getInputProps("postTitle")} placeholder="Title..." />
                                    <br />
                                    <Textarea {...form.getInputProps("postBody")} minRows={10} maxRows={20} autosize placeholder="Write here..." />
                                    <Button type="submit" color="blue" fullWidth mt="md" radius="md">
                                        Save
                                    </Button>
                                </form>
                            </Card>
                        </>
                    )}
                </main>
            </AppShell.Main>
        </AppShell>
    );
}
