import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { DashboardStats, MonthlyStat } from "../models/dashboard.model";
import { DashboardService } from "../services/dashboard.service";
import { IsAuth } from "../middlewares/auth.middleware";
import { GraphqlContext } from "../graphql/context";

@Resolver()
@UseMiddleware(IsAuth)
export class DashboardResolver {
  private dashboardService = new DashboardService();

  @Query(() => DashboardStats)
  async dashboardStats(@Ctx() ctx: GraphqlContext): Promise<DashboardStats> {
    return this.dashboardService.getDashboardStats(ctx.user);
  }

  @Query(() => [MonthlyStat])
  async monthlyStats(@Ctx() ctx: GraphqlContext): Promise<MonthlyStat[]> {
    return this.dashboardService.getMonthlyStats(ctx.user);
  }
}
