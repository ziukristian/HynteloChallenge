"use client";
import { AppShell, Center, Container, Stack, Flex, Avatar, Skeleton, Card, Text, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import Post from "@/types/Post";

export default function Home() {
    const [user, setUser] = useState("user");
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    const router = useRouter();
    var userid = null;

    useEffect(() => {
        // Fetch user data from cache
        const user = Cookies.get("bloguser");
        if (user) {
            setUser(user);
        }

        // Fetch data of posts from server
        axios("http://localhost:8080/posts")
            .then((data) => {
                setPosts(data.data.posts);
                setLoading(false);
            })
            .catch((error) => {
                showNotification({ message: error.response.data, color: "red", title: "Error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleBlogPostClick = (post: Post) => {
        router.push(`/post/${post.id}`);
    };

    const handleNewPostClick = () => {
        router.push(`/newpost`);
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
                        <Stack gap={7}>
                            <div className="w-full flex justify-end items-end">
                                <Button onClick={() => handleNewPostClick()} mt="md">
                                    New Post
                                </Button>
                            </div>
                            {posts.map((post) => (
                                <Card onClick={() => handleBlogPostClick(post)} key={post.id} style={{ cursor: "pointer" }} shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text component={"span"} fw={500}>
                                        <Center>{post.title}</Center>
                                    </Text>
                                    <Text
                                        component={"span"}
                                        size="sm"
                                        c="dimmed"
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <Center>{post.body}</Center>
                                    </Text>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </main>
            </AppShell.Main>
        </AppShell>
    );
}
