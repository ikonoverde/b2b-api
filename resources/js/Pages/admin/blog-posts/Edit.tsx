import BlogPostForm from './Form';
import type { BlogPostAdminData } from './Form';

interface Props {
    post: BlogPostAdminData;
}

export default function EditBlogPost({ post }: Props) {
    return <BlogPostForm post={post} />;
}
