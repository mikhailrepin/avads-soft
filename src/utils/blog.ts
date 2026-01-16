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

// Функция для генерации URL аватара через Unsplash на основе имени
// Используем детерминированный подход - для одного автора всегда один аватар
function generateAvatarUrl(name: string): string {
  // Генерируем хэш на основе имени для детерминированного выбора изображения
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Используем известные ID фотографий портретов из Unsplash
  // Выбираем детерминированно на основе хэша имени
  const portraitIds = [
    "1507003211169-0a1dd7228f2d", "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e",
    "1472099645785-5658abf4ff4e", "1506794778202-cad84cf45f1d", "1508214751196-bcfd4ca60f91",
    "1517841905240-472988babdf9", "1534528741775-53994a69daeb", "1527980965255-d3b416303d12",
    "1544005313-94ddf0286df2", "1539571696357-5a69c17a67c6", "1521119989659-a83eee488004",
    "1492562080023-ab3db95bfbce", "1531427186611-ecfd6d936c79", "1506794778202-cad84cf45f1d",
    "1507003211169-0a1dd7228f2d", "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e",
    "1472099645785-5658abf4ff4e", "1506794778202-cad84cf45f1d", "1508214751196-bcfd4ca60f91",
  ];
  
  const imageIndex = Math.abs(hash) % portraitIds.length;
  const photoId = portraitIds[imageIndex];
  
  // Используем Unsplash CDN для получения изображения портрета
  // Параметры: w=64&h=64 - размер, fit=crop&crop=faces - обрезка по лицам
  return `https://images.unsplash.com/photo-${photoId}?w=64&h=64&fit=crop&crop=faces&auto=format&q=80`;
}

// Функция для генерации fallback аватара с инициалами
export function generateFallbackAvatarUrl(name: string): string {
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
  
  // Используем UI Avatars API для генерации аватара с инициалами
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
          fallbackAvatar: generateFallbackAvatarUrl(author),
        };
      }),
  };
}
