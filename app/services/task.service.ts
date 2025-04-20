// app/services/task.service.ts
export interface Task {
    taskId: string;
    creatorId: string;
    title: string;
    description?: string;
    link?: string;
    amount: number;
    status: "Open" | "InProgress" | "Completed" | "Expired";
    expiryDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TaskSubmission {
    submissionId: string;
    taskId: string;
    userId: string;
    content?: string;
    isClaimed: boolean;
    claimedAt?: Date;
    status: "Submitted" | "Approved" | "Rejected";
    createdAt: Date;
    updatedAt: Date;
  }
  
  let tasks: Task[] = [];
  let taskSubmissions: TaskSubmission[] = [];
  
  export const taskService = {
    async createTask(taskData: {
      creatorId: string;
      title: string;
      description?: string;
      link?: string;
      amount: number;
      expiryDate?: Date;
    }) {
      const newTask: Task = {
        taskId: crypto.randomUUID(),
        ...taskData,
        status: "Open",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      tasks.push(newTask);
      return newTask;
    },
  
    async submitTask(submissionData: {
      taskId: string;
      userId: string;
      content?: string;
    }) {
      const newSubmission: TaskSubmission = {
        submissionId: crypto.randomUUID(),
        ...submissionData,
        isClaimed: false,
        status: "Submitted",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      taskSubmissions.push(newSubmission);
      return newSubmission;
    },

    async getAllTasks() {
      return tasks;
    },
  
    async getSubmissionsByUser(userId: string) {
      return taskSubmissions.filter((sub) => sub.userId === userId);
    },
  };
  