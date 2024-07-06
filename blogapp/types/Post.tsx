import { Comment } from "./Comment";

export default interface Post {
    id: number | null;
    author: string;
    title: string;
    body: string;
    comments: Comment[];
}
