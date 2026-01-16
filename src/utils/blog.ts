export interface AstroPost {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    image: string;
    author?: string;
  };
  file: string;
}

// Моковые имена авторов для генерации, если не указаны
const MOCK_AUTHORS = [
  "Александра Крупская",
  "Иван Петров",
  "Мария Смирнова",
  "Алексей Иванов",
  "Ольга Волкова",
  "Дмитрий Соколов",
];

// Функция для генерации мокового аватара на основе имени
function generateAvatarUrl(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  // Генерируем цвет на основе имени (простой хэш)
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  
  // Используем UI Avatars API для генерации аватара (32px для соответствия стилям)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${hue},50%,40%&color=fff&size=32&bold=true`;
}

// Функция для получения мокового автора на основе названия поста
function getMockAuthor(title: string, existingAuthor?: string): string {
  if (existingAuthor) return existingAuthor;
  
  // Генерируем индекс на основе заголовка
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MOCK_AUTHORS.length;
  return MOCK_AUTHORS[index];
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
      sortedPosts.slice(start, end).map((post) => {
        const author = getMockAuthor(
          post.frontmatter.title,
          post.frontmatter.author
        );
        return {
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          date: post.frontmatter.date,
          image: post.frontmatter.image,
          url: `/blog/${post.file.split("/").pop()?.replace(".md", "")}`,
          author,
          avatar: generateAvatarUrl(author),
        };
      }),
  };
}
