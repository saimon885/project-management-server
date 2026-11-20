import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/not-found";
import { userRoutes } from "./modules/user/user.routes";
import { organizationRoutes } from "./modules/organizations/organization.routes";
import { invitationRoutes } from "./modules/invitation/invitation.routes";
import { teamRoutes } from "./modules/teams/teams.routes";
import { teamMemberRoutes } from "./modules/Team-member/teamMember.routes";
import { projectRoutes } from "./modules/projects/projects.routes";
import { taskRoutes } from "./modules/task/task.routes";
import { subTaskRoutes } from "./modules/subTask/subTask.routes";
import { commentsRoutes } from "./modules/comments/comments.routes";
import { sprintRoutes } from "./modules/sprints/sprints.routes";
import { taskAssignRoutes } from "./modules/taskAssign/task-assign.routes";
import { getBkashIdToken } from "./lib/bkash";
import { bkashPaymentRoutes } from "./modules/bkashPayment/bkashPayment.routes";
export const app = express();

app.use(express.json());
app.use(cors({ origin: config.app_url, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
	// const getnIdtokenResult = await getBkashIdToken();
	// console.log(getnIdtokenResult);
	res.send("welcome to project management!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/invitation", invitationRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/team-member", teamMemberRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/subTasks", subTaskRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/task-assign", taskAssignRoutes);
app.use("/api/v1/payments", bkashPaymentRoutes);

app.use(globalErrorHandler);
app.use(notFound);
