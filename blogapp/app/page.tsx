"use client";
import { AppShell, Center, Container, Stack, Flex, Avatar, Skeleton, Card, Text, Button, Pagination } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import Post from "@/types/Post";

export default function Home() {
    const [user, setUser] = useState("user");
    const [loading, setLoading] = useState(true);
    const [postsData, setPostsData] = useState<any>({});
    const [page, setPage] = useState(1);

    const router = useRouter();

    useEffect(() => {
        // Fetch user data from cache
        const user = Cookies.get("bloguser");
        if (user) {
            setUser(user);
        }

        // Fetch data of posts from server
        axios("http://localhost:8080/posts")
            .then((data) => {
                setPostsData(data.data);
                setLoading(false);
            })
            .catch((error) => {
                showNotification({ message: error.response.data, color: "red", title: "Error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        // Fetch data of posts from server
        axios("http://localhost:8080/posts?page=" + page + "&pageSize=5")
            .then((data) => {
                setPostsData(data.data);
                console.log(data.data);
                setLoading(false);
            })
            .catch((error) => {
                showNotification({ message: error.response.data, color: "red", title: "Error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page]);

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
                            {postsData?.posts.map((post: Post) => (
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
                                            display: "block",
                                        }}
                                    >
                                        <Center>{post.body}</Center>
                                    </Text>
                                </Card>
                            ))}
                            <br />
                            <Center>
                                <Pagination total={postsData.totalPages == 1 ? 0 : postsData.totalPages} value={postsData.page} onChange={setPage} mt="sm" />
                            </Center>
                        </Stack>
                    )}
                </main>
            </AppShell.Main>
        </AppShell>
    );
}
