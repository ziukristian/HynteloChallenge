"use client";
import { AppShell, Center, Container, Stack, Flex, Avatar, Skeleton, Card, Text, TextInput, Button } from "@mantine/core";
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Comment } from "@/types/Comment";

export default function Post({ params }: { params: { id: number } }) {
    const [user, setUser] = useState("user");
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<any>({});

    const form = useForm({
        mode: "controlled",
        initialValues: { commentBody: "" },
        validate: {
            commentBody: hasLength({ min: 1 }, "Comment body is missing"),
        },
    });

    const router = useRouter();
    var userid = null;
    useEffect(() => {
        // Fetch user data from cache
        const user = Cookies.get("bloguser");
        userid = localStorage.getItem("bloguserid");
        if (user) {
            setUser(user);
        }

        // Fetch data of posts from server
        axios("http://localhost:8080/posts/" + params.id)
            .then((data) => {
                setPost(data.data);
                console.log(data.data);
                setLoading(false);
            })
            .catch((error) => {
                showNotification({ message: error.response.data, color: "red", title: "Error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleNewCommentSubmit = (values: typeof form.values) => {
        if (!form.isValid) {
            return;
        }

        let newComment: Comment = {
            id: 0,
            postId: post.id,
            author: user,
            body: values.commentBody,
        };

        axios
            .post("http://localhost:8080/posts/" + params.id + "/comments", newComment)
            .then((data) => {
                setPost({ ...post, comments: [...post.comments, newComment] });
                showNotification({ message: "Comment created successfully", color: "green", title: "Success" });
            })
            .catch((error) => {
                showNotification({ message: error.response.data, color: "red", title: "Error" });
            })
            .finally(() => {});
    };

    const handleBackClick = () => {
        router.push(`/`);
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
                            <Skeleton height={100} mt={6} radius="xl" />
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
                            <Card mb={5} key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
                                <Text component={"span"} fw={500}>
                                    <Center>{post.title}</Center>
                                </Text>
                                <Text
                                    style={{
                                        whiteSpace: "normal", // Allow text to wrap
                                        wordWrap: "break-word", // Handle long words
                                    }}
                                    size="sm"
                                    c="dimmed"
                                >
                                    {post.body}
                                </Text>
                            </Card>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <form onSubmit={form.onSubmit(handleNewCommentSubmit)}>
                                    <TextInput {...form.getInputProps("commentBody")} placeholder="Write here..." />

                                    <Button type="submit" color="blue" fullWidth mt="md" radius="md">
                                        Save
                                    </Button>
                                </form>
                            </Card>
                            {post.comments.map((comment: Comment) => (
                                <Card my={5} key={comment.id} style={{ cursor: "pointer" }} shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text component={"span"} size="sm" c="dimmed">
                                        <Center>{comment.body}</Center>
                                    </Text>
                                </Card>
                            ))}
                        </>
                    )}
                </main>
            </AppShell.Main>
        </AppShell>
    );
}
