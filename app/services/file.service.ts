// app/services/file.service.ts
export interface File {
    fileId: string;
    userId: string;
    fileName: string;
    fileLocation: string;
    fileType?: string;
    fileSize?: number;
    createdAt: Date;
  }
  
  let files: File[] = [];
  
  export const fileService = {
    async uploadFile(fileData: {
      userId: string;
      fileName: string;
      fileLocation: string;
      fileType?: string;
      fileSize?: number;
    }) {
      const newFile: File = {
        fileId: crypto.randomUUID(),
        ...fileData,
        createdAt: new Date(),
      };
  
      files.push(newFile);
      return newFile;
    },
  
    async getUserFiles(userId: string) {
      return files.filter(f => f.userId === userId);
    },
  
    async deleteFile(fileId: string) {
      const index = files.findIndex(f => f.fileId === fileId);
      if (index === -1) return false;
      
      files.splice(index, 1);
      return true;
    },
  };
  