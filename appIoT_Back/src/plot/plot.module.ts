import { Module } from "@nestjs/common";
import { PlotController } from "./plot.controller";
import { PlotService } from "./plot.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers: [PlotController],
    providers: [PlotService, PrismaService]
})
export class PlotModule {}