import "./global.css";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { createTheme, MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/notifications/styles.css";

const theme = createTheme({});

export const metadata: Metadata = {
    title: "Blog App",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <Notifications position="top-left" />
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
