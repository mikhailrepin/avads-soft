export interface AstroPost {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    image: string;
  };
  file: string;
}

export async function getBlogPosts(postsPerPage: number = 6) {
  const posts = await import.meta.glob<AstroPost>("../pages/blog/*.md", {
    eager: true,
  });
  const postsArray: AstroPost[] = Object.values(posts);

  const sortedPosts = postsArray
    .filter((post): post is AstroPost => {
      if (!post || !post.frontmatter) return false;
      try {
        const date = new Date(post.frontmatter.date);
        return (
          Boolean(post.frontmatter.title) &&
          Boolean(post.frontmatter.description) &&
          Boolean(post.frontmatter.date) &&
          Boolean(post.frontmatter.image) &&
          !isNaN(date.getTime())
        );
      } catch {
        return false;
      }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  return {
    totalPages,
    formatPosts: (start: number, end: number) =>
      sortedPosts.slice(start, end).map((post) => ({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        date: post.frontmatter.date,
        image: post.frontmatter.image,
        url: `/blog/${post.file.split("/").pop()?.replace(".md", "")}`,
      })),
  };
}
