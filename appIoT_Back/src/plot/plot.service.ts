import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";


@Injectable()
export class PlotService {
  constructor(private prisma: PrismaService) { }

  async createPlot(data: CreatePlotDto) {
    return this.prisma.plot.create({
      data: {
        ...data,
        lastWatered: new Date(data.lastWatered),
      },
    });
  }

  async getPlotById(id: number) {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException('Parcela no encontrada');
    }
    return plot;
  }

  async getAllPlots() {
    return this.prisma.plot.findMany();
  }

  async updatePlot(id: number, data: UpdatePlotDto) {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException('Parcela no encontrada');
    }
    return this.prisma.plot.update({ where: { id }, data });
  }

  async deletePlot(id: number) {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException('Parcela no encontrada');
    }
    return this.prisma.plot.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }
}