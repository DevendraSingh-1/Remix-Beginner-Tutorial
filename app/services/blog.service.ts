// app/services/blog.service.ts
export interface Blog {
    blogId: string;
    userId: string;
    title: string;
    content: string;
    status: 'Draft' | 'Published' | 'Archived';
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
  }
  
  export interface BlogLike {
    likeId: string;
    blogId: string;
    userId: string;
    createdAt: Date;
  }
  
  let blogs: Blog[] = [];
  let blogLikes: BlogLike[] = [];
  
  export const blogService = {
    async createBlog(blogData: {
      userId: string;
      title: string;
      content: string;
    }) {
      const newBlog: Blog = {
        blogId: crypto.randomUUID(),
        ...blogData,
        status: 'Published',
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      };
  
      blogs.push(newBlog);
      return newBlog;
    },
  
    async addLike(blogId: string, userId: string) {
      const existingLike = blogLikes.find(
        bl => bl.blogId === blogId && bl.userId === userId
      );
      
      if (existingLike) return existingLike;
  
      const newLike: BlogLike = {
        likeId: crypto.randomUUID(),
        blogId,
        userId,
        createdAt: new Date(),
      };
  
      blogLikes.push(newLike);
      return newLike;
    },
  
    async getBlogWithLikes(blogId: string) {
      const blog = blogs.find(b => b.blogId === blogId);
      if (!blog) return null;
      
      const likes = blogLikes.filter(bl => bl.blogId === blogId);
      return { ...blog, likes };
    },
  };
  